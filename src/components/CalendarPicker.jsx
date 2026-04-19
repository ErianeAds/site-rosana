import { useState, useEffect } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays, isPast } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { getMentorships } from '../firebase/services';

const CalendarPicker = ({ onSelect }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  const timeSlots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

  useEffect(() => {
    const fetchAvailability = async () => {
      setLoading(true);
      try {
        const mentorships = await getMentorships();
        // Extract dates and times that are already booked
        const booked = mentorships.map(m => ({
          dateString: m.date, // format 'dd/MM/yyyy'
          time: m.time
        }));
        setBookedSlots(booked);
      } catch (error) {
        console.error("Erro ao buscar agenda:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAvailability();
  }, []);

  const isSlotBooked = (date, time) => {
    if (!date) return false;
    const dateStr = format(date, 'dd/MM/yyyy');
    return bookedSlots.some(slot => slot.dateString === dateStr && slot.time === time);
  };

  const renderHeader = () => (
    <div className="calendar-header">
      <button type="button" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="calendar-nav-btn">
        <span className="material-symbols-outlined">chevron_left</span>
      </button>
      <h4 className="month-title">{format(currentMonth, 'MMMM yyyy', { locale: ptBR })}</h4>
      <button type="button" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="calendar-nav-btn">
        <span className="material-symbols-outlined">chevron_right</span>
      </button>
    </div>
  );

  const renderDays = () => {
    const days = [];
    const dateNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    for (let i = 0; i < 7; i++) {
      days.push(<div key={i} className="calendar-day-name">{dateNames[i]}</div>);
    }
    return <div className="calendar-week-header">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const formattedDate = format(day, 'd');
        const cloneDay = day;
        const isCurrentMonth = isSameMonth(day, monthStart);
        const isToday = isSameDay(day, new Date());
        const isDisabled = !isCurrentMonth || (isPast(day) && !isToday) || day.getDay() === 0 || day.getDay() === 6; // Disable weekends
        const isSelected = isSameDay(day, selectedDate);

        days.push(
          <div
            key={day}
            className={`calendar-cell ${isDisabled ? 'disabled' : ''} ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
            onClick={() => !isDisabled && setSelectedDate(cloneDay)}
          >
            <span className="cell-content">{formattedDate}</span>
            {isToday && <div className="today-dot" />}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(<div key={day} className="calendar-row">{days}</div>);
      days = [];
    }
    return <div className="calendar-body">{rows}</div>;
  };

  const handleTimeSelect = (time) => {
    if (isSlotBooked(selectedDate, time)) return;
    setSelectedTime(time);
    if (selectedDate) {
      onSelect({ date: selectedDate, time });
    }
  };

  return (
    <div className="calendar-picker-outer">
      <div className="calendar-responsive-grid">
        <div className="calendar-main">
          {renderHeader()}
          {renderDays()}
          {renderCells()}
          <div className="calendar-footer-info">
             <div className="info-item"><span className="dot available"></span> Livre</div>
             <div className="info-item"><span className="dot booked"></span> Ocupado</div>
          </div>
        </div>
        
        <div className="time-slots-section">
          {selectedDate ? (
            <>
              <p className="slots-title">
                Horários para <span>{format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}</span>
              </p>
              <div className="time-grid">
                {timeSlots.map(time => {
                  const booked = isSlotBooked(selectedDate, time);
                  return (
                    <button
                      key={time}
                      type="button"
                      disabled={booked}
                      onClick={() => handleTimeSelect(time)}
                      className={`time-chip ${selectedTime === time ? 'selected' : ''} ${booked ? 'booked' : ''}`}
                    >
                      {time}
                      {booked && <span className="booked-label">Indisponível</span>}
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="empty-slots-msg">
              <span className="material-symbols-outlined">calendar_today</span>
              <p>Selecione uma data para ver os horários disponíveis</p>
            </div>
          )}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .calendar-picker-outer {
          background: white;
          border-radius: 32px;
          padding: 2rem;
          border: 1px solid #f1f5f9;
          box-shadow: 0 20px 50px rgba(0, 30, 64, 0.04);
        }
        .calendar-responsive-grid { display: flex; flex-direction: column; gap: 3rem; }
        .calendar-header { display: flex; justifyContent: space-between; align-items: center; margin-bottom: 2rem; }
        .month-title { text-transform: capitalize; font-weight: 700; font-size: 1.1rem; color: #0f172a; margin: 0; }
        .calendar-week-header { display: grid; grid-template-columns: repeat(7, 1fr); text-align: center; margin-bottom: 1rem; }
        .calendar-day-name { font-size: 0.75rem; font-weight: 600; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; }
        .calendar-row { display: grid; grid-template-columns: repeat(7, 1fr); }
        .calendar-cell {
          height: 54px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          border-radius: 16px;
          font-size: 0.95rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          margin: 4px;
          position: relative;
          color: #334155;
        }
        .calendar-cell:hover:not(.disabled) { background: #f8fafc; transform: translateY(-2px); }
        .calendar-cell.selected { background: #001e40 !important; color: white !important; font-weight: 700; box-shadow: 0 10px 20px rgba(0,30,64,0.2); }
        .calendar-cell.disabled { opacity: 0.15; cursor: default; }
        .calendar-cell.today { font-weight: 700; color: #bf9b30; }
        .today-dot { width: 4px; height: 4px; background: #bf9b30; border-radius: 50%; margin-top: 2px; }

        .calendar-footer-info { display: flex; gap: 1.5rem; margin-top: 1.5rem; justify-content: center; font-size: 0.75rem; color: #64748b; }
        .info-item { display: flex; align-items: center; gap: 0.5rem; }
        .dot { width: 8px; height: 8px; border-radius: 50%; }
        .dot.available { background: #bf9b30; }
        .dot.booked { background: #e2e8f0; }

        .time-slots-section { flex: 1; display: flex; flex-direction: column; justify-content: center; }
        .slots-title { font-size: 0.9rem; font-weight: 500; color: #64748b; margin-bottom: 1.5rem; }
        .slots-title span { color: #0f172a; font-weight: 700; }
        .time-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
        .time-chip {
          padding: 1.25rem;
          border: 1px solid #f1f5f9;
          background: #f8fafc;
          border-radius: 20px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
          color: #0f172a;
        }
        .time-chip:hover:not(:disabled) { border-color: #bf9b30; transform: scale(1.02); }
        .time-chip.selected { background: #bf9b30; color: white; border-color: #bf9b30; box-shadow: 0 8px 20px rgba(191, 155, 48, 0.3); }
        .time-chip:disabled { opacity: 0.5; background: #f1f5f9; cursor: not-allowed; border: none; }
        .booked-label { fontSize: 0.65rem; font-weight: 500; color: #94a3b8; }

        .empty-slots-msg { text-align: center; color: #94a3b8; opacity: 0.8; }
        .empty-slots-msg span { font-size: 3rem; margin-bottom: 1rem; display: block; }
        .empty-slots-msg p { font-size: 0.9rem; max-width: 200px; margin: 0 auto; line-height: 1.5; }

        @media (min-width: 992px) {
          .calendar-responsive-grid { flex-direction: row !important; }
          .time-slots-section { border-left: 1px solid #f1f5f9; padding-left: 3rem; min-width: 320px; }
        }
      `}} />
    </div>
  );
};

export default CalendarPicker;


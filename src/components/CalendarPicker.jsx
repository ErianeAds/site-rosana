import { useState } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays, isPast } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const CalendarPicker = ({ onSelect }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');

  const timeSlots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];

  const renderHeader = () => (
    <div className="calendar-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
      <button type="button" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="calendar-nav-btn">
        <span className="material-symbols-outlined">chevron_left</span>
      </button>
      <h4 style={{ textTransform: 'capitalize', fontWeight: 600 }}>{format(currentMonth, 'MMMM yyyy', { locale: ptBR })}</h4>
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
    return <div className="calendar-week-header" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', fontSize: '0.75rem', color: 'var(--on-surface-variant)', marginBottom: '0.5rem' }}>{days}</div>;
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
        const isDisabled = !isSameMonth(day, monthStart) || isPast(day) && !isSameDay(day, new Date());
        const isSelected = isSameDay(day, selectedDate);

        days.push(
          <div
            key={day}
            className={`calendar-cell ${isDisabled ? 'disabled' : ''} ${isSelected ? 'selected' : ''}`}
            onClick={() => !isDisabled && setSelectedDate(cloneDay)}
          >
            <span>{formattedDate}</span>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(<div key={day} className="calendar-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>{days}</div>);
      days = [];
    }
    return <div className="calendar-body">{rows}</div>;
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    if (selectedDate) {
      onSelect({ date: selectedDate, time });
    }
  };

  return (
    <div className="calendar-picker-container" style={{ 
      background: 'rgba(255, 255, 255, 0.7)', 
      backdropFilter: 'blur(10px)',
      borderRadius: '24px', 
      padding: '1.5rem',
      border: '1px solid rgba(0, 30, 64, 0.05)',
      boxShadow: '0 10px 30px rgba(0,0,0,0.02)'
    }}>
      <div className="calendar-responsive-grid" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div className="calendar-main" style={{ flex: 1 }}>
          {renderHeader()}
          {renderDays()}
          {renderCells()}
        </div>
        
        {selectedDate && (
          <div className="time-slots-section" style={{ borderTop: '1px solid #eee', paddingTop: '1.5rem' }}>
            <p style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '1rem', textAlign: 'center' }}>
              Horários para {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
            </p>
            <div className="time-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '0.75rem' }}>
              {timeSlots.map(time => (
                <button
                  key={time}
                  type="button"
                  onClick={() => handleTimeSelect(time)}
                  className={`time-chip ${selectedTime === time ? 'selected' : ''}`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .calendar-cell {
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          border-radius: 12px;
          font-size: 0.9rem;
          transition: all 0.2s ease;
          margin: 2px;
        }
        .calendar-cell:hover:not(.disabled) { background: rgba(0, 30, 64, 0.05); }
        .calendar-cell.selected { background: var(--secondary) !important; color: white !important; font-weight: bold; }
        .calendar-cell.disabled { opacity: 0.2; cursor: default; }
        .time-chip {
          padding: 0.6rem;
          border: 1px solid #e1e8f0;
          background: white;
          border-radius: 12px;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        .time-chip:hover { border-color: var(--secondary); color: var(--secondary); }
        .time-chip.selected { background: var(--secondary); color: white; border-color: var(--secondary); }
        .calendar-nav-btn {
          background: none; border: none; cursor: pointer; color: var(--secondary); padding: 5px; border-radius: 50%; display: flex;
        }
        .calendar-nav-btn:hover { background: rgba(0,30,64,0.05); }

        @media (min-width: 768px) {
          .calendar-responsive-grid { flex-direction: row !important; }
          .time-slots-section { border-top: none !important; border-left: 1px solid #eee; padding-top: 0 !important; padding-left: 1.5rem; min-width: 180px; }
        }
      `}} />
    </div>
  );
};

export default CalendarPicker;

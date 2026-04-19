import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays, subMonths, addMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const JourneyCalendar = ({ sessions }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const parseDate = (dStr) => {
    if (!dStr) return null;
    const [d, m, y] = dStr.split('/').map(Number);
    return new Date(y, m - 1, d);
  };

  const sessionsByDate = sessions.reduce((acc, sess) => {
    const d = sess.date;
    if (!acc[d]) acc[d] = [];
    acc[d].push(sess);
    return acc;
  }, {});

  const renderHeader = () => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
      <h3 style={{ fontFamily: "'Noto Serif', serif", margin: 0, color: 'var(--primary)', fontSize: '1.25rem' }}>
        {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
      </h3>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} style={navBtnStyle}>
          <span className="material-symbols-outlined">chevron_left</span>
        </button>
        <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} style={navBtnStyle}>
          <span className="material-symbols-outlined">chevron_right</span>
        </button>
      </div>
    </div>
  );

  const renderDays = () => {
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: '1rem' }}>
        {days.map(d => (
          <div key={d} style={{ textAlign: 'center', fontSize: '0.7rem', fontWeight: '800', color: '#735b25', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            {d}
          </div>
        ))}
      </div>
    );
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
        const dateStr = format(day, 'dd/MM/yyyy');
        const daySessions = sessionsByDate[dateStr] || [];
        const isCurrentMonth = isSameMonth(day, monthStart);
        const isToday = isSameDay(day, new Date());
        
        days.push(
          <div key={day} style={{
            height: '80px',
            padding: '8px',
            background: isCurrentMonth ? 'var(--surface-container-lowest)' : 'transparent',
            opacity: isCurrentMonth ? 1 : 0.2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            position: 'relative',
            borderRadius: '12px',
            margin: '2px',
            transition: 'all 0.3s'
          }}>
            <span style={{ 
                fontSize: '0.85rem', 
                fontWeight: isToday ? '900' : '500', 
                color: isToday ? '#735b25' : 'var(--primary)',
                marginBottom: '8px'
            }}>
              {format(day, 'd')}
            </span>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', justifyContent: 'center' }}>
                {daySessions.map((s, idx) => (
                    <div key={idx} title={s.serviceTitle} style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: s.status === 'confirmed' ? '#22c55e' : '#735b25',
                        boxShadow: s.status === 'confirmed' ? '0 0 10px rgba(34, 197, 94, 0.4)' : 'none'
                    }} />
                ))}
            </div>

            {daySessions.length > 0 && isCurrentMonth && (
                <div className="session-popup" style={{
                    position: 'absolute',
                    bottom: '8px',
                    fontSize: '0.6rem',
                    textAlign: 'center',
                    width: '100%',
                    color: 'var(--primary)',
                    fontWeight: '700',
                    maxWidth: '90%',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis'
                }}>
                    {daySessions[0].time}h
                </div>
            )}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(<div key={day} style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>{days}</div>);
      days = [];
    }
    return <div>{rows}</div>;
  };

  return (
    <div className="journey-calendar-card" style={{
        background: 'var(--surface-container-low)',
        padding: '2rem',
        borderRadius: '32px',
        marginTop: '2.5rem'
    }}>
      {renderHeader()}
      {renderDays()}
      {renderCells()}
      
      <div style={{ display: 'flex', gap: '20px', marginTop: '1.5rem', justifyContent: 'center', fontSize: '0.75rem', fontWeight: '600', color: 'var(--on-surface-variant)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e' }}></span> Confirmada
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#735b25' }}></span> Pendente
        </div>
      </div>
    </div>
  );
};

const navBtnStyle = {
  background: 'white',
  border: 'none',
  width: '36px',
  height: '36px',
  borderRadius: '10px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  color: 'var(--primary)',
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
};

export default JourneyCalendar;

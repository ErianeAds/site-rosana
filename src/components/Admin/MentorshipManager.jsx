import React, { useState } from 'react';
import { db } from '../../firebase/config';
import { doc, updateDoc } from 'firebase/firestore';
import { DayPicker } from 'react-day-picker';
import { format, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import 'react-day-picker/dist/style.css';

const MentorshipManager = ({ mentorships, onUpdate, notify }) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await updateDoc(doc(db, 'mentorships', id), { status: newStatus });
      notify('success', 'Status estratégico atualizado.');
      onUpdate();
    } catch (e) {
      notify('error', 'Falha ao processar atualização.');
    }
  };

  // Mapear dias com sessões
  const sessionDays = mentorships.map(m => {
    try {
      return parse(m.date, 'dd/MM/yyyy', new Date());
    } catch (e) {
      return null;
    }
  }).filter(Boolean);

  const modifiers = {
    hasSession: sessionDays
  };

  const modifiersStyles = {
    hasSession: {
      fontWeight: 'bold',
      color: 'white',
      backgroundColor: '#735b25',
      borderRadius: '50%'
    }
  };

  return (
    <div className="mentorship-management-container">
      <div className="agenda-vision-grid">
        {/* Calendário da Mentora */}
        <div className="admin-view-card calendar-card-exclusive">
          <div className="card-header-exclusive">
            <h3>Agenda da Mentora</h3>
            <p>Distribuição mensal das sessões ativas.</p>
          </div>
          
          <div className="calendar-wrapper">
            <style>{`
              .rdp { --rdp-accent-color: #735b25; margin: 0; }
              .rdp-day_selected { background-color: #735b25 !important; }
              .has-session-dot { position: relative; }
              .has-session-dot::after {
                content: '';
                position: absolute;
                bottom: 4px;
                left: 50%;
                transform: translateX(-50%);
                width: 4px;
                height: 4px;
                background: #735b25;
                border-radius: 50%;
              }
            `}</style>
            <DayPicker 
              locale={ptBR}
              mode="single"
              selected={new Date()}
              modifiers={modifiers}
              modifiersClassNames={{ hasSession: 'has-session-dot' }}
              month={selectedMonth}
              onMonthChange={setSelectedMonth}
            />
          </div>
        </div>

        {/* Resumo Rápido */}
        <div className="stats-vision-card">
          <div className="stat-box">
            <span className="stat-label">Total de Sessões</span>
            <span className="stat-value">{mentorships.length}</span>
          </div>
          <div className="stat-box">
            <span className="stat-label">Confirmadas</span>
            <span className="stat-value">{mentorships.filter(m => m.status === 'confirmed').length}</span>
          </div>
          <div className="stat-box">
            <span className="stat-label">Aguardando</span>
            <span className="stat-value">{mentorships.filter(m => m.status === 'pending_payment' || !m.status).length}</span>
          </div>
        </div>
      </div>

      <div className="admin-view-card" style={{ marginTop: '1.5rem' }}>
        <div className="card-header-exclusive">
          <h3>Próximos Compromissos</h3>
          <p>Lista detalhada de mentorias e status.</p>
        </div>

        <div className="table-responsive-layer">
          <table className="admin-executive-table">
            <thead>
              <tr>
                <th>ALUNO</th>
                <th>PROGRAMA</th>
                <th>CRONOGRAMA</th>
                <th>ESTÁGIO</th>
              </tr>
            </thead>
            <tbody>
              {mentorships.map((m, i) => (
                <tr key={i} className="row-elevated">
                  <td className="cell-primary">
                    <div className="user-info-stack">
                      <strong>{m.studentName}</strong>
                      <span>{m.studentEmail}</span>
                    </div>
                  </td>
                  <td>{m.serviceTitle}</td>
                  <td>
                    <div className="date-time-bubble">
                      {m.date} <span className="separator">•</span> {m.time}hs
                    </div>
                  </td>
                  <td>
                    <select 
                      value={m.status || 'pending'} 
                      onChange={(e) => handleUpdateStatus(m.id, e.target.value)}
                      className={`status-select-tag ${m.status}`}
                    >
                      <option value="pending_payment">Aguard. Pagamento</option>
                      <option value="confirmed">Confirmado / Ativo</option>
                      <option value="completed">Ciclo Concluído</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        .agenda-vision-grid {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 1.5rem;
          align-items: start;
        }

        .calendar-card-exclusive {
          padding: 1.5rem;
          width: fit-content;
        }

        .calendar-wrapper {
          background: var(--surface-container-lowest);
          border-radius: 20px;
          padding: 10px;
          border: 1px solid var(--outline-variant);
        }

        .stats-vision-card {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
        }

        .stat-box {
          background: white;
          padding: 1.5rem;
          border-radius: 24px;
          border: 1px solid var(--outline-variant);
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .stat-label {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-weight: 800;
          color: #735b25;
        }

        .stat-value {
          font-size: 2rem;
          font-weight: 300;
          color: var(--primary);
        }

        @media (max-width: 1024px) {
          .agenda-vision-grid {
            grid-template-columns: 1fr;
          }
          .calendar-card-exclusive {
            width: 100%;
          }
          .stats-vision-card {
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          }
        }
      `}</style>
    </div>
  );
};

export default MentorshipManager;

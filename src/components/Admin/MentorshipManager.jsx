import React from 'react';
import { db } from '../../firebase/config';
import { doc, updateDoc } from 'firebase/firestore';

const MentorshipManager = ({ mentorships, onUpdate, notify }) => {
  
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await updateDoc(doc(db, 'mentorships', id), { status: newStatus });
      notify('success', 'Status estratégico atualizado.');
      onUpdate();
    } catch (e) {
      notify('error', 'Falha ao processar atualização.');
    }
  };

  return (
    <div className="admin-view-card">
      <div className="card-header-exclusive">
        <h3>Gestão de Mentorias</h3>
        <p>Acompanhe aqui todos os seus agendamentos e sessões.</p>
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
  );
};

export default MentorshipManager;

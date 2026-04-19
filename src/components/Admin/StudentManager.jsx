import React from 'react';

const StudentManager = ({ mentorships }) => {
  const uniqueStudents = [...new Set(mentorships.map(m => m.studentEmail))].map(email => {
    return mentorships.find(m => m.studentEmail === email);
  });

  return (
    <div className="student-ecosystem-viewport">
      <div className="ecosystem-header">
        <h3>Ecossistema de Alunos</h3>
        <p>Base consolidada de ativos e talentos em acompanhamento.</p>
      </div>

      <div className="students-tiles-grid">
        {uniqueStudents.map((s, i) => (
          <div key={i} className="student-profile-card">
            <div className="avatar-circle-layered">
              {s.studentName[0]}
            </div>
            <div className="profile-details">
              <h4>{s.studentName}</h4>
              <p>{s.studentEmail}</p>
            </div>
            <div className="card-fringe"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentManager;

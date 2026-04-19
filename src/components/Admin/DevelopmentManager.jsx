import React, { useState, useEffect, useRef } from 'react';
import { 
    getStudentProgress, 
    updateStudentProgress, 
    uploadFile,
    deleteFile 
} from '../../firebase/services';

const DevelopmentManager = ({ mentorships, notify }) => {
  const fileInputRef = useRef(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [progress, setProgress] = useState({
    currentPillar: 'Diagnóstico',
    objective: '',
    tasks: [],
    materials: []
  });
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [newTask, setNewTask] = useState({ title: '', dueDate: '' });
  const [newMaterial, setNewMaterial] = useState({ title: '', url: '', pillar: 'Diagnóstico', type: 'link' });

  const uniqueStudents = [...new Set(mentorships.map(m => m.studentId))].map(id => {
    return mentorships.find(m => m.studentId === id);
  }).filter(s => s && s.studentId);

  useEffect(() => {
    if (selectedStudent) {
      fetchProgress(selectedStudent.studentId);
    }
  }, [selectedStudent]);

  const fetchProgress = async (id) => {
    setLoading(true);
    try {
      const data = await getStudentProgress(id);
      if (data) {
        setProgress({
          currentPillar: data.currentPillar || 'Diagnóstico',
          objective: data.objective || '',
          tasks: data.tasks || [],
          materials: data.materials || []
        });
      } else {
        setProgress({
          currentPillar: 'Diagnóstico',
          objective: '',
          tasks: [],
          materials: []
        });
      }
    } catch (e) {
      notify('error', 'Erro ao carregar progresso.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProgress = async (updates) => {
    const updated = { ...progress, ...updates };
    setProgress(updated);
    if (!selectedStudent) return;
    setSaveLoading(true);
    try {
      await updateStudentProgress(selectedStudent.studentId, updated);
      notify('success', 'Registro atualizado.');
    } catch (e) {
      notify('error', 'Erro ao salvar.');
    } finally {
      setSaveLoading(false);
    }
  };

  const addTask = () => {
    if (!newTask.title) return;
    const task = {
      id: Date.now(),
      title: newTask.title,
      dueDate: newTask.dueDate,
      status: 'pending',
      feedback: ''
    };
    handleUpdateProgress({ tasks: [...progress.tasks, task] });
    setNewTask({ title: '', dueDate: '' });
  };

  const removeTask = (id) => {
    handleUpdateProgress({ tasks: progress.tasks.filter(t => t.id !== id) });
  };

  const updateTaskStatus = (taskId) => {
    const newTasks = progress.tasks.map(t => 
      t.id === taskId ? { ...t, status: t.status === 'completed' ? 'pending' : 'completed' } : t
    );
    handleUpdateProgress({ tasks: newTasks });
  };

  const addMaterial = () => {
    if (!newMaterial.title || !newMaterial.url) return;
    handleUpdateProgress({ materials: [...progress.materials, newMaterial] });
    setNewMaterial({ title: '', url: '', pillar: progress.currentPillar, type: 'link' });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !selectedStudent) return;

    setUploading(true);
    setUploadProgress(0);
    try {
      const path = `mentorship_assets/${selectedStudent.studentId}/${Date.now()}_${file.name}`;
      const url = await uploadFile(file, path, (p) => setUploadProgress(p));
      
      const fileMaterial = {
          title: file.name,
          url: url,
          storagePath: path,
          pillar: progress.currentPillar,
          type: 'file'
      };

      await handleUpdateProgress({ materials: [...progress.materials, fileMaterial] });
      notify('success', 'Arquivo enviado com sucesso.');
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      notify('error', 'Erro ao enviar arquivo.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const removeMaterial = async (index) => {
    const material = progress.materials[index];
    
    if (material.type === 'file' && material.storagePath) {
        try {
            await deleteFile(material.storagePath);
        } catch (e) {
            console.error("Erro ao deletar arquivo físico:", e);
        }
    }

    handleUpdateProgress({ materials: progress.materials.filter((_, i) => i !== index) });
  };

  if (!selectedStudent && uniqueStudents.length > 0) {
    return (
      <div className="dev-manager-container">
        <header className="ecosystem-header">
          <h3>Evolução de Talentos</h3>
          <p>Selecione um liderado para gerenciar o roadmap estratégico.</p>
        </header>
        <div className="students-grid">
          {uniqueStudents.map((s, i) => (
            <div key={i} className="student-card" onClick={() => setSelectedStudent(s)}>
              <div className="student-info">
                <div className="student-avatar">
                  {s.studentName[0]}
                </div>
                <div className="student-details">
                  <h4>{s.studentName}</h4>
                  <p>{s.studentEmail}</p>
                </div>
              </div>
              <div className="student-action">
                <span className="material-symbols-outlined">auto_awesome</span>
                <span>Gerenciar Jornada</span>
              </div>
            </div>
          ))}
        </div>

        <style jsx>{`
          .dev-manager-container {
            padding: 1rem;
          }
          
          .ecosystem-header {
            margin-bottom: 2rem;
          }
          
          .ecosystem-header h3 {
            font-family: 'Noto Serif', serif;
            color: #0b1c30;
            font-size: clamp(1.5rem, 5vw, 1.75rem);
            margin-bottom: 0.5rem;
          }
          
          .ecosystem-header p {
            color: #735b25;
            font-weight: bold;
            font-size: 0.8rem;
            text-transform: uppercase;
            letter-spacing: 0.1em;
          }
          
          .students-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 1rem;
          }
          
          .student-card {
            cursor: pointer;
            background: var(--surface-container-low);
            padding: 1.5rem;
            border-radius: 32px;
            transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
          }
          
          @media (hover: hover) {
            .student-card:hover {
              transform: translateY(-4px);
            }
          }
          
          .student-info {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-bottom: 1rem;
            flex-wrap: wrap;
          }
          
          .student-avatar {
            width: 56px;
            height: 56px;
            background: var(--surface-container-lowest);
            color: #0b1c30;
            border-radius: 22px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 1.5rem;
            box-shadow: 0 4px 10px rgba(0,0,0,0.02);
            flex-shrink: 0;
          }
          
          .student-details {
            flex: 1;
            min-width: 150px;
          }
          
          .student-details h4 {
            margin: 0 0 4px 0;
            color: #0b1c30;
            font-family: 'Noto Serif', serif;
            font-size: 1rem;
          }
          
          .student-details p {
            margin: 0;
            font-size: 0.75rem;
            opacity: 0.6;
            word-break: break-all;
          }
          
          .student-action {
            background: white;
            padding: 10px 16px;
            border-radius: 12px;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            width: fit-content;
          }
          
          .student-action span:first-child {
            font-size: 16px;
            color: #735b25;
          }
          
          .student-action span:last-child {
            font-size: 0.7rem;
            font-weight: 800;
            color: var(--primary);
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }
          
          @media (max-width: 640px) {
            .dev-manager-container {
              padding: 0.75rem;
            }
            
            .student-card {
              padding: 1.25rem;
            }
            
            .student-avatar {
              width: 48px;
              height: 48px;
              font-size: 1.25rem;
            }
          }
        `}</style>
      </div>
    );
  }

  const studentSessions = mentorships
    .filter(m => m.studentId === selectedStudent?.studentId)
    .sort((a, b) => b.createdAt?.localeCompare(a.createdAt));

  const PILLARS = ['Diagnóstico', 'Planejamento', 'Execução', 'Follow-up'];
  const completedTasks = progress.tasks.filter(t => t.status === 'completed').length;

  if (loading) return (
    <div className="loading-container">
      Sincronizando trilha estratégica...
      <style jsx>{`
        .loading-container {
          padding: 3rem;
          text-align: center;
        }
      `}</style>
    </div>
  );

  return (
    <div className="dev-manager-container">
      <header className="main-header">
        <div className="header-left">
          <button className="back-button" onClick={() => setSelectedStudent(null)}>
            <span className="material-symbols-outlined">keyboard_backspace</span>
            Voltar ao Ecossistema
          </button>
          <h3 className="student-name">{selectedStudent?.studentName}</h3>
        </div>
        <div className="header-right">
          <span className="status-label">Status Atual:</span>
          <select 
            value={progress.currentPillar} 
            onChange={(e) => handleUpdateProgress({ currentPillar: e.target.value })}
            className="pillar-select"
          >
            {PILLARS.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </header>

      <div className="two-columns">
        {/* Coluna Esquerda */}
        <div className="left-column">
          
          {/* Objetivo */}
          <section className="card objective-card">
            <h4 className="section-title">
              <span className="material-symbols-outlined">target</span>
              Objetivo do Ciclo
            </h4>
            <textarea 
              placeholder="Qual o foco principal desta fase?"
              value={progress.objective}
              onChange={(e) => setProgress(prev => ({ ...prev, objective: e.target.value }))}
              onBlur={() => handleUpdateProgress({ objective: progress.objective })}
              className="objective-input"
              rows={3}
            />
          </section>

          {/* Postar Material */}
          <section className="card material-card">
            <h4 className="material-title">
              <span className="material-symbols-outlined">library_add</span>
              Postar Novo Material
            </h4>
            <div className="material-form">
              <input 
                type="text" 
                placeholder="Título do Material (ex: PDF de Branding)" 
                value={newMaterial.title}
                onChange={(e) => setNewMaterial({...newMaterial, title: e.target.value})}
                className="material-input"
              />
              <input 
                type="text" 
                placeholder="Link do Download / Documento" 
                value={newMaterial.url}
                onChange={(e) => setNewMaterial({...newMaterial, url: e.target.value})}
                className="material-input"
              />
              <div className="material-actions">
                <select 
                  value={newMaterial.pillar}
                  onChange={(e) => setNewMaterial({...newMaterial, pillar: e.target.value})}
                  className="pillar-select-light"
                >
                  {PILLARS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                <button onClick={addMaterial} className="link-button">LINKAR</button>
              </div>

              <div className="upload-area">
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} style={{ display: 'none' }} />
                <button 
                  disabled={uploading}
                  onClick={() => fileInputRef.current.click()}
                  className="upload-button"
                >
                  <span className={`material-symbols-outlined ${uploading ? 'spin' : ''}`}>
                    {uploading ? 'sync' : 'upload_file'}
                  </span>
                  {uploading ? 'TRANSFERINDO...' : 'OU UPLOAD DIRETO DE ARQUIVO'}
                </button>
                
                {uploading && (
                  <div className="upload-progress">
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${uploadProgress}%` }}></div>
                    </div>
                    <p>{Math.round(uploadProgress)}% Concluído</p>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Histórico */}
          <section className="card history-card">
            <h4>Compromissos Recentes</h4>
            <div className="history-list">
              {studentSessions.slice(0, 3).map((s, i) => (
                <div key={i} className="history-item">
                  <span className="history-date">{s.date}</span>
                  <span className="history-title">{s.serviceTitle}</span>
                </div>
              ))}
              {studentSessions.length === 0 && (
                <p className="empty-message">Nenhum compromisso registrado</p>
              )}
            </div>
          </section>
        </div>

        {/* Coluna Direita */}
        <div className="right-column">
          
          {/* Conteúdos */}
          <section className="card contents-card">
            <h4>Conteúdos Enviados</h4>
            
            <div className="contents-list">
              {PILLARS.map(pillar => {
                const pillarMaterials = progress.materials.filter(m => m.pillar === pillar);
                if (pillarMaterials.length === 0) return null;
                return (
                  <div key={pillar} className="pillar-group">
                    <h5>{pillar}</h5>
                    <div className="materials-list">
                      {pillarMaterials.map((mat, idx) => (
                        <div key={idx} className="material-item">
                          <div className="material-info">
                            <span className="material-symbols-outlined">
                              {mat.type === 'file' ? 'attach_file' : 'link'}
                            </span>
                            <a 
                              href={mat.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="material-link"
                            >
                              {mat.title}
                            </a>
                          </div>
                          <button onClick={() => removeMaterial(progress.materials.indexOf(mat))} className="delete-btn">
                            <span className="material-symbols-outlined">delete</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
              {progress.materials.length === 0 && (
                <p className="empty-message">Ainda não foram postados materiais para este ciclo.</p>
              )}
            </div>
          </section>

          {/* Tarefas */}
          <section className="card tasks-card">
            <div className="tasks-header">
              <h4>Plano de Ação (Checklist)</h4>
              <span className="tasks-count">{completedTasks}/{progress.tasks.length} concluídas</span>
            </div>
            
            <div className="add-task">
              <input 
                type="text" 
                placeholder="Adicionar tarefa executiva..." 
                value={newTask.title}
                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                onKeyPress={(e) => e.key === 'Enter' && addTask()}
                className="task-input"
              />
              <button onClick={addTask} className="add-task-btn">
                <span className="material-symbols-outlined">add</span>
              </button>
            </div>

            <div className="tasks-list">
              {progress.tasks.map((task) => (
                <div key={task.id} className="task-item">
                  <div className="task-main" onClick={() => updateTaskStatus(task.id)}>
                    <span className="material-symbols-outlined task-status">
                      {task.status === 'completed' ? 'check_circle' : 'radio_button_unchecked'}
                    </span>
                    <p className="task-title" data-completed={task.status === 'completed'}>
                      {task.title}
                    </p>
                  </div>
                  <button onClick={() => removeTask(task.id)} className="delete-task-btn">
                    <span className="material-symbols-outlined">delete_outline</span>
                  </button>
                  
                  <textarea 
                    placeholder="Adicionar feedback ou ajuste estratégico..."
                    value={task.feedback}
                    onChange={(e) => {
                      const newTasks = progress.tasks.map(t => t.id === task.id ? {...t, feedback: e.target.value} : t);
                      setProgress({...progress, tasks: newTasks});
                    }}
                    onBlur={() => handleUpdateProgress({ tasks: progress.tasks })}
                    className="task-feedback"
                    rows={2}
                  />
                </div>
              ))}
              {progress.tasks.length === 0 && (
                <p className="empty-message">Nenhuma tarefa adicionada. Comece criando seu plano de ação!</p>
              )}
            </div>
          </section>
        </div>
      </div>

      {saveLoading && (
        <div className="save-toast">
          Sincronizando Mentoria...
        </div>
      )}

      <style jsx>{`
        .dev-manager-container {
          padding: 1rem;
          max-width: 1400px;
          margin: 0 auto;
        }
        
        /* Header */
        .main-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }
        
        .header-left {
          flex: 1;
        }
        
        .back-button {
          background: transparent;
          border: none;
          color: #735b25;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
          font-size: 0.75rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }
        
        .student-name {
          margin: 0;
          font-family: 'Noto Serif', serif;
          color: #0b1c30;
          font-size: clamp(1.5rem, 5vw, 2rem);
          word-break: break-word;
        }
        
        .header-right {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }
        
        .status-label {
          font-size: 0.75rem;
          font-weight: 800;
          color: #735b25;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }
        
        .pillar-select {
          background: var(--surface-container-low);
          border: none;
          padding: 10px 20px;
          border-radius: 16px;
          font-weight: 700;
          color: #0b1c30;
          outline: none;
          cursor: pointer;
        }
        
        /* Grid */
        .two-columns {
          display: grid;
          grid-template-columns: 1fr 1.6fr;
          gap: 1.5rem;
        }
        
        .left-column,
        .right-column {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        
        /* Cards */
        .card {
          background: var(--surface-container-low);
          padding: 1.5rem;
          border-radius: 32px;
        }
        
        .section-title {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: #735b25;
          font-weight: 900;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .section-title span {
          font-size: 18px;
        }
        
        .objective-input {
          width: 100%;
          background: var(--surface-container-lowest);
          border: none;
          padding: 1rem;
          border-radius: 20px;
          font-size: clamp(0.9rem, 4vw, 1rem);
          font-family: 'Noto Serif', serif;
          font-style: italic;
          color: #0b1c30;
          resize: vertical;
          outline: none;
          line-height: 1.5;
        }
        
        /* Material Card */
        .material-card {
          background: var(--primary);
          color: white;
        }
        
        .material-title {
          font-family: 'Noto Serif', serif;
          color: white;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: clamp(1rem, 4vw, 1.25rem);
        }
        
        .material-title span {
          color: #735b25;
        }
        
        .material-form {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        
        .material-input {
          background: rgba(255,255,255,0.1);
          border: none;
          padding: 12px 16px;
          border-radius: 14px;
          color: white;
          outline: none;
          font-size: 0.9rem;
        }
        
        .material-input::placeholder {
          color: rgba(255,255,255,0.7);
        }
        
        .material-actions {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }
        
        .pillar-select-light {
          flex: 1;
          min-width: 120px;
          background: rgba(255,255,255,0.1);
          border: none;
          padding: 12px;
          border-radius: 14px;
          color: white;
          outline: none;
          font-size: 0.85rem;
        }
        
        .pillar-select-light option {
          background: #333;
        }
        
        .link-button {
          background: #735b25;
          color: white;
          border: none;
          padding: 0 20px;
          border-radius: 14px;
          cursor: pointer;
          font-weight: bold;
          text-transform: uppercase;
          font-size: 0.7rem;
          white-space: nowrap;
        }
        
        .upload-area {
          border-top: 1px solid rgba(255,255,255,0.1);
          padding-top: 1rem;
          margin-top: 0.5rem;
        }
        
        .upload-button {
          width: 100%;
          background: rgba(115, 91, 37, 0.1);
          color: white;
          border: 1.5px dashed rgba(255,255,255,0.2);
          padding: 12px;
          border-radius: 16px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          font-size: 0.7rem;
          font-weight: 700;
          transition: all 0.3s;
        }
        
        .upload-button:disabled {
          background: rgba(255,255,255,0.05);
          cursor: not-allowed;
        }
        
        .upload-progress {
          margin-top: 0.75rem;
        }
        
        .progress-bar {
          height: 4px;
          width: 100%;
          background: rgba(255,255,255,0.1);
          border-radius: 10px;
          overflow: hidden;
        }
        
        .progress-fill {
          height: 100%;
          background: #735b25;
          transition: width 0.3s ease;
        }
        
        .upload-progress p {
          font-size: 0.6rem;
          color: rgba(255,255,255,0.6);
          margin-top: 6px;
          text-align: center;
          font-weight: bold;
        }
        
        /* History Card */
        .history-card h4 {
          margin-bottom: 1rem;
          font-family: 'Noto Serif', serif;
          color: #0b1c30;
          font-size: 1rem;
        }
        
        .history-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        
        .history-item {
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        
        .history-date {
          font-weight: 600;
          color: #0b1c30;
        }
        
        .history-title {
          opacity: 0.6;
          word-break: break-word;
          text-align: right;
        }
        
        /* Contents Card */
        .contents-card h4 {
          font-family: 'Noto Serif', serif;
          color: #0b1c30;
          margin-bottom: 1.5rem;
          border-bottom: 1px solid rgba(115, 91, 37, 0.1);
          padding-bottom: 0.75rem;
          font-size: clamp(1rem, 4vw, 1.25rem);
        }
        
        .contents-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        
        .pillar-group h5 {
          font-size: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: #735b25;
          margin-bottom: 0.75rem;
        }
        
        .materials-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .material-item {
          background: white;
          padding: 10px 14px;
          border-radius: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        
        .material-info {
          display: flex;
          align-items: center;
          gap: 10px;
          flex: 1;
          min-width: 150px;
        }
        
        .material-info span:first-child {
          font-size: 18px;
          color: #735b25;
          flex-shrink: 0;
        }
        
        .material-link {
          font-size: 0.85rem;
          font-weight: 600;
          color: #0b1c30;
          text-decoration: none;
          word-break: break-all;
          flex: 1;
        }
        
        .material-link:hover {
          text-decoration: underline;
        }
        
        .delete-btn {
          background: transparent;
          border: none;
          color: #ef4444;
          cursor: pointer;
          opacity: 0.5;
          padding: 4px;
          flex-shrink: 0;
        }
        
        /* Tasks Card */
        .tasks-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        
        .tasks-header h4 {
          font-family: 'Noto Serif', serif;
          color: #0b1c30;
          margin: 0;
          font-size: clamp(1rem, 4vw, 1.25rem);
        }
        
        .tasks-count {
          font-size: 0.7rem;
          color: #735b25;
          font-weight: 600;
        }
        
        .add-task {
          display: flex;
          gap: 8px;
          margin-bottom: 1.5rem;
        }
        
        .task-input {
          flex: 1;
          background: var(--surface-container-lowest);
          border: none;
          padding: 12px 16px;
          border-radius: 16px;
          outline: none;
          font-size: 0.9rem;
        }
        
        .add-task-btn {
          background: #735b25;
          color: white;
          border: none;
          padding: 0 16px;
          border-radius: 16px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .tasks-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          max-height: 500px;
          overflow-y: auto;
        }
        
        .task-item {
          background: white;
          padding: 1rem;
          border-radius: 20px;
        }
        
        .task-main {
          display: flex;
          gap: 10px;
          align-items: center;
          flex: 1;
          cursor: pointer;
          margin-bottom: 0.75rem;
        }
        
        .task-status {
          font-size: 20px;
          flex-shrink: 0;
        }
        
        .task-title {
          margin: 0;
          font-weight: 700;
          color: #0b1c30;
          font-size: 0.9rem;
          flex: 1;
        }
        
        .task-title[data-completed="true"] {
          text-decoration: line-through;
          opacity: 0.7;
        }
        
        .delete-task-btn {
          background: transparent;
          border: none;
          color: #ef4444;
          cursor: pointer;
          opacity: 0.4;
          padding: 4px;
          float: right;
        }
        
        .task-feedback {
          width: 100%;
          background: var(--surface-container-low);
          border: none;
          padding: 10px;
          border-radius: 12px;
          font-size: 0.75rem;
          font-family: 'Noto Serif', serif;
          font-style: italic;
          color: #735b25;
          resize: vertical;
          outline: none;
          margin-top: 0.5rem;
        }
        
        .empty-message {
          text-align: center;
          opacity: 0.4;
          font-style: italic;
          font-size: 0.85rem;
          padding: 2rem 0;
        }
        
        /* Toast */
        .save-toast {
          position: fixed;
          bottom: 1rem;
          right: 1rem;
          background: var(--primary);
          color: white;
          padding: 0.7rem 1.2rem;
          border-radius: 100px;
          font-size: 0.75rem;
          font-weight: bold;
          box-shadow: 0 8px 30px rgba(0,0,0,0.2);
          z-index: 2000;
        }
        
        /* Animações */
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .spin {
          animation: spin 1s linear infinite;
        }
        
        /* Responsividade */
        @media (max-width: 1024px) {
          .two-columns {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
        }
        
        @media (max-width: 768px) {
          .dev-manager-container {
            padding: 0.75rem;
          }
          
          .main-header {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .header-right {
            width: 100%;
          }
          
          .pillar-select {
            flex: 1;
          }
          
          .card {
            padding: 1.25rem;
          }
        }
        
        @media (max-width: 480px) {
          .dev-manager-container {
            padding: 0.5rem;
          }
          
          .card {
            padding: 1rem;
            border-radius: 24px;
          }
          
          .material-actions {
            flex-direction: column;
          }
          
          .link-button {
            padding: 12px 20px;
          }
          
          .student-avatar {
            width: 48px;
            height: 48px;
          }
        }
        
        @media (prefers-reduced-motion: reduce) {
          .student-card,
          .upload-button,
          .link-button,
          .add-task-btn {
            transition: none;
          }
          
          .student-card:hover {
            transform: none;
          }
        }
      `}</style>
    </div>
  );
};

export default DevelopmentManager;
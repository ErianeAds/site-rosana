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
    swot: { strengths: '', weaknesses: '', opportunities: '', threats: '' },
    futureVision: '',
    tasks: [],
    featuredImage: null
  });
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [newTask, setNewTask] = useState({ title: '', dueDate: '' });

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
          swot: data.swot || { strengths: '', weaknesses: '', opportunities: '', threats: '' },
          futureVision: data.futureVision || '',
          tasks: data.tasks || [],
          featuredImage: data.featuredImage || null
        });
      } else {
        setProgress({
          currentPillar: 'Diagnóstico',
          swot: { strengths: '', weaknesses: '', opportunities: '', threats: '' },
          futureVision: '',
          tasks: [],
          featuredImage: null
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

  const processImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Redimensionamento inteligente (Máximo 1200px)
          const MAX_WIDTH = 1200;
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          // Qualidade 0.7 para ser leve e rápido
          const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
          resolve(dataUrl);
        };
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageUrlChange = async (url) => {
    let finalUrl = url;
    if (url.includes('drive.google.com')) {
        const driveId = url.split('/d/')[1]?.split('/')[0];
        if (driveId) finalUrl = `https://drive.google.com/uc?export=view&id=${driveId}`;
    }
    handleUpdateProgress({ featuredImage: url ? { url: finalUrl, type: 'url' } : null });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !selectedStudent) return;

    setUploading(true);
    try {
      // Processamento local (Sem CORS, sem servidor)
      const optimizedBase64 = await processImage(file);
      
      const newImage = {
        url: optimizedBase64,
        type: 'file',
        createdAt: new Date().toISOString()
      };

      await handleUpdateProgress({ featuredImage: newImage });
      notify('success', 'Banner processado e atualizado!');
    } catch (err) {
      console.error("Erro no processamento:", err);
      notify('error', 'Falha ao processar imagem localmente.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
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

        <style>{`
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
      <style>{`
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
        {/* Coluna Principal (Estratégia) */}
        <div className="main-column">
          
          {/* Matriz SWOT / FOFA */}
          <section className="card swot-section">
            <h4 className="section-title">
              <span className="material-symbols-outlined">grid_view</span>
              Diagnóstico Estratégico (SWOT)
            </h4>
            
            <div className="swot-grid">
              <div className="swot-item strengths">
                <label>Pontos Fortes & Talentos</label>
                <textarea 
                  value={progress.swot?.strengths}
                  onChange={(e) => setProgress(prev => ({ ...prev, swot: { ...prev.swot, strengths: e.target.value } }))}
                  onBlur={() => handleUpdateProgress({ swot: progress.swot })}
                  placeholder="Quais são as suas principais alavancas de sucesso?"
                />
              </div>
              <div className="swot-item weaknesses">
                <label>Desafios de Crescimento</label>
                <textarea 
                  value={progress.swot?.weaknesses}
                  onChange={(e) => setProgress(prev => ({ ...prev, swot: { ...prev.swot, weaknesses: e.target.value } }))}
                  onBlur={() => handleUpdateProgress({ swot: progress.swot })}
                  placeholder="Quais comportamentos ou habilidades precisamos evoluir?"
                />
              </div>
              <div className="swot-item opportunities">
                <label>Janelas de Oportunidade</label>
                <textarea 
                  value={progress.swot?.opportunities}
                  onChange={(e) => setProgress(prev => ({ ...prev, swot: { ...prev.swot, opportunities: e.target.value } }))}
                  onBlur={() => handleUpdateProgress({ swot: progress.swot })}
                  placeholder="Quais portas se abrem com o seu desenvolvimento?"
                />
              </div>
              <div className="swot-item threats">
                <label>Riscos & Atenção</label>
                <textarea 
                  value={progress.swot?.threats}
                  onChange={(e) => setProgress(prev => ({ ...prev, swot: { ...prev.swot, threats: e.target.value } }))}
                  onBlur={() => handleUpdateProgress({ swot: progress.swot })}
                  placeholder="O que pode desviar você do seu objetivo?"
                />
              </div>
            </div>

            <div className="future-vision-section">
              <label className="vision-label">
                <span className="material-symbols-outlined">auto_awesome</span>
                Visão de Futuro
              </label>
              <textarea 
                value={progress.futureVision}
                onChange={(e) => setProgress(prev => ({ ...prev, futureVision: e.target.value }))}
                onBlur={() => handleUpdateProgress({ futureVision: progress.futureVision })}
                placeholder="Quem você quer ser ao final deste ciclo?"
                className="vision-textarea"
                rows={3}
              />
            </div>
          </section>

          {/* Histórico - Agora mais discreto no final da coluna estratégica */}
          <section className="card history-card">
            <h4 className="section-title">
                <span className="material-symbols-outlined">history</span>
                Ciclos de Mentoria
            </h4>
            <div className="history-list">
              {studentSessions.slice(0, 5).map((s, i) => (
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

        {/* Coluna Lateral (Ação & Visual) */}
        <div className="side-column">
          
          {/* Tarefas */}
          <section className="card tasks-card">
            <div className="tasks-header">
              <h4 className="section-title">
                  <span className="material-symbols-outlined">checklist</span>
                  Plano de Ação
              </h4>
              <span className="tasks-count">{completedTasks}/{progress.tasks.length}</span>
            </div>
            
            <div className="add-task">
              <input 
                type="text" 
                placeholder="Nova tarefa..." 
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
                </div>
              ))}
            </div>
          </section>

          {/* Link da Imagem */}
          <section className="card material-card-new">
            <h4 className="section-title">
              <span className="material-symbols-outlined">image</span>
              Banner Visual
            </h4>
            <div className="image-url-management">
                <div className="input-group-hybrid">
                    <input 
                      type="text" 
                      placeholder="Cole a URL ou use o botão de upload ➔"
                      value={progress.featuredImage?.type === 'url' ? progress.featuredImage.url : ''}
                      onChange={(e) => handleImageUrlChange(e.target.value)}
                      className="url-input-field"
                    />
                    <button 
                        className="upload-trigger-btn"
                        onClick={() => fileInputRef.current.click()}
                        disabled={uploading}
                    >
                        <span className="material-symbols-outlined">
                            {uploading ? 'sync' : 'cloud_upload'}
                        </span>
                    </button>
                </div>

                <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" style={{ display: 'none' }} />

                {uploading && (
                    <div className="mini-progress-bar">
                        <div className="mini-progress-fill" style={{ width: `${uploadProgress}%` }}></div>
                    </div>
                )}
              
              <div className="image-preview-container-mini" style={{ marginTop: '1rem' }}>
                {progress.featuredImage?.url ? (
                  <img 
                    src={progress.featuredImage.url} 
                    alt="Preview" 
                    className="featured-preview-mini" 
                    onError={(e) => {
                        if (progress.featuredImage.type === 'url') {
                            e.target.src = 'https://placehold.co/600x400?text=Link+Invalido';
                        }
                    }}
                  />
                ) : (
                  <div className="empty-preview-placeholder" onClick={() => fileInputRef.current.click()} style={{ cursor: 'pointer' }}>
                    <span className="material-symbols-outlined">add_photo_alternate</span>
                    <p>Clique ou cole um link</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>

      {saveLoading && (
        <div className="save-toast">
          Sincronizando Mentoria...
        </div>
      )}

      <style>{`
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
        
        /* Grid Redistribuído */
        .two-columns {
          display: grid;
          grid-template-columns: 1.8fr 1fr;
          gap: 1.5rem;
        }
        
        .main-column,
        .side-column {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .input-group-hybrid {
          display: flex;
          gap: 8px;
          margin-bottom: 0.5rem;
        }

        .upload-trigger-btn {
          background: #735b25;
          color: white;
          border: none;
          padding: 0 16px;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .upload-trigger-btn:hover { background: #5a461d; transform: scale(1.02); }
        .upload-trigger-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .mini-progress-bar {
          height: 3px;
          width: 100%;
          background: #eee;
          border-radius: 2px;
          margin: 8px 0;
          overflow: hidden;
        }

        .mini-progress-fill {
          height: 100%;
          background: #735b25;
          transition: width 0.3s;
        }

        .image-preview-container-mini {
          width: 100%;
          aspect-ratio: 16/9;
          border-radius: 16px;
          overflow: hidden;
          background: var(--surface-container-highest);
          border: 1px solid var(--outline-variant);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s;
        }

        .image-preview-container-mini:hover { border-color: #735b25; }

        .featured-preview-mini {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
        }

        .empty-preview-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          opacity: 0.3;
        }

        .empty-preview-placeholder span { font-size: 32px; }
        .empty-preview-placeholder p { fontSize: 0.65rem; font-weight: bold; }

        @media (max-width: 1024px) {
          .two-columns {
            grid-template-columns: 1fr;
          }
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
        
        /* SWOT Grid */
        .swot-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        
        .swot-item {
          background: var(--surface-container-lowest);
          padding: 12px;
          border-radius: 16px;
          border: 1px solid var(--outline-variant);
        }
        
        .swot-item label {
          display: block;
          font-size: 0.65rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 8px;
        }
        
        .strengths label { color: #22c55e; }
        .weaknesses label { color: #dc2626; }
        .opportunities label { color: #3b82f6; }
        .threats label { color: #f59e0b; }
        
        .swot-item textarea {
          width: 100%;
          background: transparent;
          border: none;
          font-size: 0.85rem;
          color: #0b1c30;
          resize: none;
          outline: none;
          min-height: 80px;
          line-height: 1.4;
        }

        .future-vision-section {
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid var(--outline-variant);
        }

        .vision-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.75rem;
          font-weight: 800;
          color: #735b25;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 1rem;
        }

        .vision-label span {
          font-size: 18px;
          color: #735b25;
        }

        .vision-textarea {
          width: 100%;
          background: var(--surface-container-lowest);
          border: 1px solid var(--outline-variant);
          padding: 1rem;
          border-radius: 16px;
          font-size: 0.95rem;
          font-family: 'Noto Serif', serif;
          font-style: italic;
          color: #0b1c30;
          outline: none;
          resize: vertical;
          line-height: 1.6;
        }
        
        /* Novos Estilos Imagem de Destaque */
        .material-card-new {
          background: white;
          padding: 1.5rem;
          border: 1px solid var(--surface-container-high);
        }
        
        .material-title-new {
          font-family: 'Noto Serif', serif;
          color: #0b1c30;
          margin-bottom: 1.25rem;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 1.1rem;
        }
        
        .image-management {
          position: relative;
          width: 100%;
        }
        
        .image-preview-container {
          position: relative;
          width: 100%;
          aspect-ratio: 16/9;
          border-radius: 20px;
          overflow: hidden;
          background: #f5f5f5;
        }
        
        .featured-preview {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .image-overlay-actions {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          opacity: 0;
          transition: opacity 0.3s;
        }
        
        .image-preview-container:hover .image-overlay-actions {
          opacity: 1;
        }
        
        .delete-overlay-btn, .edit-overlay-btn {
          background: white;
          border: none;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #0b1c30;
          transition: transform 0.2s;
        }
        
        .delete-overlay-btn:hover { color: #dc2626; transform: scale(1.1); }
        .edit-overlay-btn:hover { color: var(--primary); transform: scale(1.1); }
        
        .url-input-field {
          width: 100%;
          background: var(--surface-container-lowest);
          border: 1px solid var(--outline-variant);
          padding: 12px 16px;
          border-radius: 12px;
          font-size: 0.85rem;
          color: #0b1c30;
          outline: none;
          transition: all 0.3s;
        }

        .url-input-field:focus {
          border-color: #735b25;
          box-shadow: 0 0 0 3px rgba(115, 91, 37, 0.1);
        }

        .spin {
          animation: rotate 2s linear infinite;
        }
        
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
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
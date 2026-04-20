import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  getCourses, 
  getSiteContent, 
  getMentorships 
} from '../../firebase/services';

// Componentes Extraídos
import AdminSidebar from './AdminSidebar';
import MentorshipManager from './MentorshipManager';
import BrandManager from './BrandManager';
import ServiceManager from './ServiceManager';
import StudentManager from './StudentManager';
import DevelopmentManager from './DevelopmentManager';
import TestimonialManager from './TestimonialManager';

const AdminDashboard = () => {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState('agenda');
  const [data, setData] = useState({
    mentorships: [],
    courses: [],
    siteContent: {}
  });
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const notify = (type, text) => {
    setNotification({ type, text });
    setTimeout(() => setNotification(null), 3000);
  };

  const syncData = useCallback(async (tab) => {
    setLoading(true);
    try {
      if (tab === 'agenda' || tab === 'students' || tab === 'dev_management') {
        const mentorships = await getMentorships();
        setData(prev => ({ ...prev, mentorships: mentorships || [] }));
      } else if (tab === 'content') {
        const courses = await getCourses();
        setData(prev => ({ ...prev, courses: courses || [] }));
      } else if (tab === 'brand') {
        const content = await getSiteContent();
        setData(prev => ({ ...prev, siteContent: content || {} }));
      }
    } catch (err) {
      notify('error', 'Falha na sincronização de dados executivos.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    syncData(activeTab);
  }, [activeTab, syncData]);

  const renderContent = () => {
    if (loading) return <div className="admin-loader-container">Buscando Ativos...</div>;

    switch (activeTab) {
      case 'agenda': return <MentorshipManager mentorships={data.mentorships} onUpdate={() => syncData('agenda')} notify={notify} />;
      case 'brand': return <BrandManager content={data.siteContent} onUpdate={() => syncData('brand')} notify={notify} />;
      case 'content': return <ServiceManager courses={data.courses} onUpdate={() => syncData('content')} notify={notify} />;
      case 'students': return <StudentManager mentorships={data.mentorships} />;
      case 'dev_management': return <DevelopmentManager mentorships={data.mentorships} notify={notify} />;
      case 'testimonials': return <TestimonialManager notify={notify} />;
      default: return null;
    }
  };

  return (
    <div className="admin-app-layout">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={logout} />
      
      <main className="admin-main-viewport">
        <header className="admin-header-strip">
          <div className="header-meta">
            <span className="admin-breadcrumb">Plataforma de Gestão / </span>
            <span className="current-view">{getTabLabel(activeTab)}</span>
          </div>
          <button onClick={() => syncData(activeTab)} className="action-circular-btn" title="Sincronizar Dados">
            <span className="material-symbols-outlined">sync</span>
          </button>
        </header>

        {notification && (
          <div className={`admin-notification-toast ${notification.type}`}>
            {notification.text}
          </div>
        )}

        <section className="admin-content-layer">
          {renderContent()}
        </section>
      </main>
    </div>
  );
};

const getTabLabel = (id) => {
  const mapping = {
    'agenda': 'Gestão de Mentorias',
    'brand': 'Conteúdo & Identidade',
    'content': 'Serviços & Preços',
    'students': 'Meus Alunos',
    'dev_management': 'Gestão de Desenvolvimento',
    'testimonials': 'Depoimentos (Vozes de Sucesso)'
  };
  return mapping[id] || id;
};


export default AdminDashboard;

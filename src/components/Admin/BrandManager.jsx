import React, { useState } from 'react';
import { updateSiteSection } from '../../firebase/services';

const BrandManager = ({ content, onUpdate, notify }) => {
  const [localContent, setLocalContent] = useState(content);

  const handleSave = async (sectionId) => {
    try {
      await updateSiteSection(sectionId, localContent[sectionId]);
      notify('success', `${sectionId.toUpperCase()} sincronizado com sucesso.`);
      onUpdate();
    } catch (e) {
      notify('error', `Falha ao salvar seção ${sectionId}.`);
    }
  };

  return (
    <div className="brand-architecture-viewport">
      
      {/* 1. Canais de Comunicação */}
      <div className="brand-section-elevated">
        <div className="section-meta-header">
          <div>
            <h3>Canais de Contato</h3>
            <p>Configuração do seu E-mail, WhatsApp e link de reuniões.</p>
          </div>
          <button className="btn-save-exclusive" onClick={() => handleSave('contact')}>
            Salvar Canais
          </button>
        </div>

        <div className="input-grid-premium">
          <div className="input-group-layered">
            <label>E-mail Corporativo</label>
            <input 
              type="email" 
              value={localContent.contact?.email || ''} 
              onChange={e => setLocalContent({...localContent, contact: {...localContent.contact, email: e.target.value}})} 
            />
          </div>
          <div className="input-group-layered">
            <label>WhatsApp Executivo</label>
            <input 
              type="text" 
              value={localContent.contact?.whatsapp || ''} 
              onChange={e => setLocalContent({...localContent, contact: {...localContent.contact, whatsapp: e.target.value}})} 
            />
          </div>
          <div className="input-group-layered full-width">
            <label>Link Permanente para Mentorias (Google Meet / Zoom)</label>
            <input 
              type="text" 
              value={localContent.contact?.meetingLink || ''} 
              onChange={e => setLocalContent({...localContent, contact: {...localContent.contact, meetingLink: e.target.value}})} 
              placeholder="https://meet.google.com/..."
            />
          </div>
        </div>
      </div>

      {/* 2. Primeira Impressão (Boas-vindas) */}
      <div className="brand-section-elevated">
        <div className="section-meta-header">
          <div>
            <h3>Boas-vindas (Topo do Site)</h3>
            <p>Gerencie o título e o texto que os visitantes veem primeiro.</p>
          </div>
          <button className="btn-save-exclusive" onClick={() => handleSave('hero')}>
            Salvar Mudanças
          </button>
        </div>
        <div className="input-grid-premium">
          <div className="input-group-layered full-width">
            <label>Título de Impacto (Headline)</label>
            <input 
              type="text" 
              value={localContent.hero?.title || ''} 
              onChange={e => setLocalContent({...localContent, hero: {...localContent.hero, title: e.target.value}})} 
            />
          </div>
          <div className="input-group-layered full-width">
            <label>Texto de Apoio (Explicação do seu trabalho)</label>
            <textarea 
              rows="3"
              value={localContent.hero?.subtitle || ''} 
              onChange={e => setLocalContent({...localContent, hero: {...localContent.hero, subtitle: e.target.value}})} 
            />
          </div>
          <div className="input-group-layered">
            <label>Texto do Botão de Agendamento</label>
            <input 
              type="text" 
              value={localContent.hero?.primaryCTA || ''} 
              onChange={e => setLocalContent({...localContent, hero: {...localContent.hero, primaryCTA: e.target.value}})} 
            />
          </div>
          <div className="input-group-layered">
            <label>Texto do Segundo Botão</label>
            <input 
              type="text" 
              value={localContent.hero?.secondaryCTA || ''} 
              onChange={e => setLocalContent({...localContent, hero: {...localContent.hero, secondaryCTA: e.target.value}})} 
            />
          </div>
          <div className="input-group-layered full-width">
            <label>Link da Foto de Capa (Topo do Site)</label>
            <input 
              type="text" 
              value={localContent.hero?.imageUrl || ''} 
              onChange={e => setLocalContent({...localContent, hero: {...localContent.hero, imageUrl: e.target.value}})} 
              placeholder="https://exemplo.com/sua-foto.jpg"
            />
          </div>
        </div>
      </div>

      {/* 3. Sua História (Sobre) */}
      <div className="brand-section-elevated">
        <div className="section-meta-header">
          <div>
            <h3>Sua História & Propósito</h3>
            <p>Edite sua biografia e como você se apresenta aos alunos.</p>
          </div>
          <button className="btn-save-exclusive" onClick={() => handleSave('about')}>
            Salvar Sobre
          </button>
        </div>
        <div className="input-grid-premium">
          <div className="input-group-layered full-width">
            <label>Título da Seção Sobre</label>
            <input 
              type="text" 
              value={localContent.about?.mainHeading || ''} 
              onChange={e => setLocalContent({...localContent, about: {...localContent.about, mainHeading: e.target.value}})} 
            />
          </div>
          <div className="input-group-layered full-width">
            <label>Sua Biografia (Resumo para o site)</label>
            <textarea 
              rows="5"
              value={localContent.about?.biographyText || ''} 
              onChange={e => setLocalContent({...localContent, about: {...localContent.about, biographyText: e.target.value}})} 
            />
          </div>
          <div className="input-group-layered full-width">
            <label>Sua Missão ou Valor Principal</label>
            <textarea 
              rows="3"
              value={localContent.about?.missionStatement || ''} 
              onChange={e => setLocalContent({...localContent, about: {...localContent.about, missionStatement: e.target.value}})} 
            />
          </div>
          <div className="input-group-layered full-width">
            <label>Link da Sua Foto (Seção Sobre)</label>
            <input 
              type="text" 
              value={localContent.about?.imageUrl || ''} 
              onChange={e => setLocalContent({...localContent, about: {...localContent.about, imageUrl: e.target.value}})} 
              placeholder="https://exemplo.com/foto-perfil.jpg"
            />
          </div>
        </div>
      </div>

      {/* 4. Meus Números & Impacto */}
      <div className="brand-section-elevated">
        <div className="section-meta-header">
          <div>
            <h3>Meus Resultados & Impacto</h3>
            <p>Gerencie os indicadores e números de destaque que aparecem no site.</p>
          </div>
          <button className="btn-save-exclusive" onClick={() => handleSave('metrics')}>
            Salvar Números
          </button>
        </div>
        <div className="input-grid-premium">
          <div className="input-group-layered">
            <label>Anos de Experiência (Só o número)</label>
            <input 
              type="text" 
              value={localContent.metrics?.yearsExperience || ''} 
              onChange={e => setLocalContent({...localContent, metrics: {...localContent.metrics, yearsExperience: e.target.value}})} 
            />
          </div>
          <div className="input-group-layered">
            <label>Legenda dos anos (ex: Anos de Experiência)</label>
            <input 
              type="text" 
              value={localContent.metrics?.yearsLabel || ''} 
              onChange={e => setLocalContent({...localContent, metrics: {...localContent.metrics, yearsLabel: e.target.value}})} 
            />
          </div>
          <div className="input-group-layered">
            <label>Número de Alunos Atendidos</label>
            <input 
              type="text" 
              value={localContent.metrics?.studentsCount || ''} 
              onChange={e => setLocalContent({...localContent, metrics: {...localContent.metrics, studentsCount: e.target.value}})} 
            />
          </div>
          <div className="input-group-layered">
            <label>Número de Projetos (Opcional)</label>
            <input 
              type="text" 
              value={localContent.metrics?.projectsCount || ''} 
              onChange={e => setLocalContent({...localContent, metrics: {...localContent.metrics, projectsCount: e.target.value}})} 
            />
          </div>
        </div>
      </div>

      <div className="brand-info-layer">
        <div className="info-icon-circle">
          <span className="material-symbols-outlined">identity_platform</span>
        </div>
        <div className="info-text">
          <h4>Sua Marca em Boas Mãos</h4>
          <p>Tudo o que você altera aqui é refletido instantaneamente no site para seus alunos e visitantes.</p>
        </div>
      </div>
    </div>
  );
};

export default BrandManager;

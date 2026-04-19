# Rosana Brito | Mentoria de Carreira Arquitetônica

Plataforma premium para gestão de mentorias, integrando site institucional, área do aluno e dashboard administrativo.

🔗 **Links do Projeto:**
*   **Site ao Vivo:** [https://site-rosana-8a91e.web.app](https://site-rosana-8a91e.web.app)
*   **Repositório GitHub:** [https://github.com/ErianeAds/site-rosana](https://github.com/ErianeAds/site-rosana)

---

## 🚀 Guia de Utilização

### 1. Para Alunos (Fluxo de Agendamento)
1. **Acesso**: O aluno acessa a home e pode navegar pelos serviços oferecidos.
2. **Login**: Para agendar, o sistema solicita login via **Google Authentication** (garantindo segurança e agilidade).
3. **Escolha do Plano**: Seleciona o pacote de mentoria desejado.
4. **Reserva na Agenda**:
   - Escolha uma data no calendário (os fins de semana são bloqueados).
   - Selecione um horário disponível (horários já agendados por outros alunos aparecem como ocupados em tempo real).
5. **Pagamento**: Após confirmar o formulário, o aluno recebe o link de pagamento ou chave PIX.
6. **Área do Aluno**: Ao acessar a "Área do Aluno", ele visualiza o status das suas sessões e tem acesso direto ao link do **Google Meet** para reuniões confirmadas.

### 2. Para a Administradora (Gestão)
1. **Acesso Admin**: Login restrito para o e-mail cadastrado (`eriane.adsfecap@gmail.com`).
2. **Agenda & Sessões**: Visualização de todos os pedidos, com controle de status (Pendente -> Confirmado -> Realizado).
3. **Produtos & Pagamentos**: Gestor de planos onde é possível criar novos serviços, alterar preços e atualizar links de checkout/PIX.
4. **Design & Automação**: Gerenciamento de links permanentes de reunião e informações de contato que refletem em todo o site.

### 3. Para Desenvolvedores (Manutenção)
*   **Deploy Automático**: Qualquer alteração enviada para o branch `main` (`git push origin main`) dispara um **GitHub Action** que faz o build e publica a nova versão no Firebase Hosting automaticamente.
*   **Ambiente Local**: `npm run dev` para desenvolvimento em tempo real.

---

## 🛠 Composição do Sistema

O sistema foi construído utilizando tecnologias de ponta para garantir performance, estética premium e segurança:

### **Frontend (Interface)**
*   **React + Vite**: Base rápida e moderna para a aplicação.
*   **Vanilla CSS**: Sistema de design customizado com inspiração em luxo e arquitetura.
*   **Date-fns**: Processamento inteligente de datas e fusos horários.
*   **Material Symbols**: Ícones modernos e minimalistas.

### **Backend & Infraestrutura (Firebase)**
*   **Firestore**: Banco de dados NoSQL em tempo real para agenda, produtos e conteúdos.
*   **Authentication**: Login social seguro via Google.
*   **Hosting**: Hospedagem global de alta performance.
*   **Security Rules**: Camada de proteção no banco de dados garantindo que apenas a admin altere conteúdos e alunos vejam apenas suas próprias sessões.

### **CI/CD (Automação)**
*   **GitHub Actions**: Pipeline de integração contínua configurada para deploys automáticos em ambientes de Preview (PR) e Produção (Merge).

---

## 📁 Estrutura de Pastas
*   `/src/components/Admin`: Dashboard de gestão exclusiva.
*   `/src/components/Student`: Painel de controle do aluno.
*   `/src/firebase`: Configurações e serviços de comunicação com o banco de dados.
*   `.github/workflows`: Regras da automação de deploy.

---
*Desenvolvido com foco em sofisticação e conversão.*

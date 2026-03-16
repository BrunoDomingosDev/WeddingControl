# 💍 Wedding Control

Um sistema completo e seguro de gerenciamento de casamento, focado em facilitar o controle de convidados, confirmação de presença (RSVP inteligente) e a organização financeira para os noivos.

## 🚀 Sobre o Projeto

O **Wedding Control** foi projetado para tirar o peso do planejamento manual de um evento complexo. Com um painel administrativo robusto para os noivos e uma experiência intuitiva e sem fricções para os convidados, a plataforma cobre todo o ciclo de vida da jornada do casamento, desde a estruturação do orçamento até o grande dia.

## ✨ Principais Funcionalidades

- **Autenticação Segura (Área dos Noivos):** Acesso restrito via sistema de login protegido por JWT (JSON Web Tokens) e interceptadores Axios para blindagem de rotas no front-end.
- **Gestão de Convidados:** Controle de grupos (Família, Amigos), quantidade de pessoas por convite e acompanhamento em tempo real do status de confirmação.
- **RSVP com Privacidade (Busca Cega):** Sistema de confirmação de presença via QR Code Único. O convidado não tem acesso à lista geral; ele se identifica através de um código VIP ou telefone, garantindo total privacidade e precisão (evitando erros de digitação de nomes).
- **Controle Financeiro e Fornecedores:** Dashboard integrado para gerenciar categorias, registrar pagamentos e acompanhar os orçamentos do evento.
- **Lista de Presentes (Em Breve):** Integração planejada para pagamentos e presentes virtuais com baixa automática.

## 🛠️ Tecnologias e Arquitetura

O projeto adota uma arquitetura em camadas, separando as responsabilidades de interface de usuário (Front-end) da lógica de negócios e persistência de dados (Back-end API).

**Front-end (Web):**
- [React.js](https://react.dev/) (Vite)
- [React Router DOM](https://reactrouter.com/) (Navegação e Rotas Privadas)
- [React Bootstrap](https://react-bootstrap.netlify.app/) (Componentes visuais e responsividade)
- [Axios](https://axios-http.com/) (Comunicação HTTP com interceptadores de Authorization)
- [Lucide React](https://lucide.dev/) (Ícones SVG)

**Back-end (API):**
- [C# / .NET](https://dotnet.microsoft.com/) 
- Entity Framework Core
- Autenticação e Autorização via JWT (Bearer Token)

## 📁 Estrutura do Repositório

- `/Front/wedding-control-web`: Contém todo o código fonte da Single Page Application (SPA) em React.
- `/WeddingControl.Api`: Contém o código fonte da API RESTful desenvolvida em C#.

## ⚙️ Como Executar o Projeto Localmente

### Pré-requisitos
- [Node.js](https://nodejs.org/) (v18 ou superior)
- [.NET SDK](https://dotnet.microsoft.com/download) (v8.0 ou superior)
- Banco de dados configurado na *Connection String* da API.

### 1. Rodando o Front-end (React)
Navegue até o diretório da aplicação web e instale as dependências:
```bash
cd Front/wedding-control-web
npm install
npm run dev

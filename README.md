# Teste Iagiliza Fullstack - Chat com IA "Liza"

Este é um projeto full-stack desenvolvido como um teste técnico para a Iagiliza. A aplicação consiste em um sistema de chat em tempo real onde o usuário pode interagir com uma assistente de IA chamada "Liza". O projeto abrange desde a autenticação de usuários até a edição de perfil e a troca de mensagens.

## Funcionalidades

- **Landing Page:** Página de apresentação inicial para novos usuários.
- **Autenticação de Usuários:** Sistema completo com cadastro e login usando tokens JWT para segurança.
- **Chat Interativo:** Interface de chat onde o usuário envia mensagens e recebe respostas da IA.
- **Respostas da IA:** A assistente "Liza" responde com uma variedade de frases pré-definidas de forma aleatória.
- **Edição de Perfil:** O usuário pode alterar seu nome, email e senha em uma tela dedicada.
- **Interface Intuitiva:** Telas de formulário com validação de dados em tempo real e opção para visualizar senhas.
- **Navegação com Roteamento:** Utiliza `react-router-dom` para uma experiência de SPA (Single-Page Application) completa, com URLs funcionais e suporte ao histórico do navegador.

---

## Tecnologias Utilizadas

### Frontend
- **React** (com Vite)
- **TypeScript**
- **TailwindCSS** para estilização
- **React Router Dom** para roteamento
- **React Hook Form** e **Zod** para validação de formulários
- **Axios** para requisições HTTP
- **Heroicons** para iconografia

### Backend

- **Fastify**
- **TypeScript**
- **Prisma ORM** para interação com o banco de dados
- **PostgreSQL** como banco de dados
- **JWT (JSON Web Tokens)** para autenticação
- **Bcrypt** para hashing de senhas
- **Zod** para validação de requisições

### Ferramentas de Desenvolvimento
- **Concurrently** para iniciar os servidores de frontend e backend com um único comando.
- **ts-node-dev** para hot-reload do servidor backend.

---

## Como Instalar e Rodar o Projeto

Siga os passos abaixo para configurar e executar o projeto em sua máquina local.

### Pré-requisitos

Antes de começar, você precisa ter instalado:
- **Node.js** (versão 18 ou superior)
- **npm** (geralmente instalado com o Node.js)
- Uma instância do **PostgreSQL** rodando em sua máquina.

### 1. Clonar o Repositório

```bash
git clone https://github.com/VictorHugo-Neo/teste-iagiliza-fullstack.git
```
### 2. Configurar o Backend

##### 1. Navegue para a pasta do backend
```
cd backend
```
##### 2. Instale as dependências

```
npm install
```
##### 3. Crie o arquivo de variáveis de ambiente

```
# Renomeie o arquivo .env.example para .env
```
##### 4. Edite o arquivo .env
```
DATABASE_URL="postgresql://SEU_USUARIO:SUA_SENHA@localhost:5432/NOME_DO_SEU_BANCO?schema=public"
JWT_SECRET="coloque_uma_chave_secreta_bem_forte_aqui"
```
##### 5. Sincronize o banco de dados 
```
npx prisma db push
```
##### 6. Volte para a pasta raiz.
```
cd ..
```
### 3. Configurar o FrontEnd

##### 1. Navegue para a pasta do FrontEnd
```
cd frontend
```
##### 2. Instale as dependências
```
npm install
```
#####  3. Volte para a pasta raiz
```
cd ..
```

### 4. Rodar Aplicação
##### 1. Instale as dependências
```
npm install
```
##### 2. Inicie os dois servidores
```
npm run dev
```

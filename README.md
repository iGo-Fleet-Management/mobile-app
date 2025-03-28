# Backend Project

## 📋 Descrição do Projeto
Projeto backend Node.js estruturado com Express, utilizando arquitetura em camadas para separação de responsabilidades.

## 🚀 Tecnologias Principais
- Node.js
- Express
- Sequelize
- PostgreSQL
- JWT Authentication

## 📂 Estrutura do Projeto

```
src/
├── config/         # Configurações do projeto
├── controllers/    # Controladores das rotas
├── middlewares/    # Middlewares personalizados
├── models/         # Modelos de dados
├── repositories/   # Camada de acesso a dados
├── routes/         # Definição de rotas
├── services/       # Lógica de negócio
├── validators/     # Validadores de entrada
├── app.js          # Configuração do Express
└── server.js       # Inicialização do servidor
```

## 🔧 Instalação

### Pré-requisitos
- Node.js (v18+)
- PostgreSQL

### Passos de Instalação
1. Clone o repositório
```bash
git clone https://seu-repositorio.git
cd backend
```

2. Instale as dependências
```bash
npm install
```

3. Configure as variáveis de ambiente
```bash
cp .env.example .env
# Edite o .env com suas configurações
```

## 🛠️ Scripts Disponíveis

- `npm start`: Inicia o servidor de produção
- `npm run dev`: Inicia o servidor em modo de desenvolvimento
- `npm test`: Executa os testes
- `npm run lint`: Verifica a qualidade do código
- `npm run format`: Formata o código

## 🔒 Variáveis de Ambiente
Crie um arquivo `.env` com as seguintes variáveis:
- `PORT`: Porta do servidor
- `DATABASE_URL`: Conexão do banco de dados
- `JWT_SECRET`: Chave secreta para JWT

## 🤝 Contribuição
1. Faça um fork do projeto
2. Crie sua feature branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📜 Licença
Este projeto está licenciado sob a Licença ISC.
```

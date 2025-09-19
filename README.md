# API Gerenciador de Tarefas

Esta é uma API REST simples para gerenciar tarefas, construída com Node.js, Express.

## Funcionalidades

- Registro e Login de usuários com autenticação baseada em JWT.
- CRUD de tarefas (Criar, Ler, Atualizar).
- Autorização: um usuário só pode gerenciar suas próprias tarefas.
- Documentação da API com Swagger.

## Estrutura do Projeto

O projeto é dividido em duas pastas principais:

- `src`: Contém a lógica de negócio, modelos e serviços.
- `rest`: Contém a camada de apresentação (rotas, controladores, middlewares e configuração do Swagger).

O banco de dados é simulado em memória.

## Como Executar

1. **Instale as dependências:**
   ```bash
   npm install
   ```

2. **Inicie o servidor:**
   ```bash
   node server.js
   ```

O servidor estará rodando em `http://localhost:3000`.

## Documentação da API

A documentação do Swagger está disponível em `http://localhost:3000/api-docs`.

## Endpoints da API

### Autenticação

- `POST /auth/register`: Registra um novo usuário.
- `POST /auth/login`: Autentica um usuário e retorna um token JWT.

### Tarefas (Requer autenticação)

- `POST /tasks`: Cria uma nova tarefa.
- `GET /tasks`: Lista todas as tarefas do usuário autenticado.
- `PUT /tasks/:id`: Atualiza uma tarefa existente.

## Autenticação

O padrão recomendado para autenticação é usar o cabeçalho:

```
Authorization: Bearer SEU_TOKEN_JWT
```

Exemplo com curl:

```bash
curl -X GET 'http://localhost:3000/tasks' \
   -H 'Authorization: Bearer SEU_TOKEN_JWT'
```

# API Gerenciador de Tarefas

Projeto desenvolvido para a Pós-graduação em Automação de Testes de Software (PGATS-2025-02)

## Desafio do Trabalho

> **Descrição(resumo):**  
> Construa uma API em Rest ou GraphQL para resolver um problema simples que exija se autenticar antes e implemente testes automatizados rodando na pipeline para ela usando Supertest, Mocha e Chai.

## Objetivo

Construir uma API REST com Javascript e Express para gerenciar tarefas, incluindo autenticação de usuário via JWT e documentação Swagger.  
A API serve de base para aprender e aplicar testes automatizados em ambiente de pipeline CI/CD.

A estrutura inicial desta API foi gerada com o auxílio do assistente de IA GitHub Copilot, a partir do seguinte prompt:
A estrutura inicial desta API foi gerada com o auxílio do assistente de IA GitHub Copilot, a partir do seguinte prompt:

```json
{
  "Objetivo": "Construir uma API Rest com Javascript e Express para gerenciar tarefas, incluindo autenticação de usuário via JWT e documentação Swagger. A API servirá de base para aprender e aplicar testes automatizados em um ambiente de pipeline.",
  "Contexto": {
    "Problema": "É necessário desenvolver uma API simples e segura. O projeto deve focar na implementação de autenticação (JWT) e testes automatizados, evitando funcionalidades complexas como transações financeiras.",
    "Fluxo_de_Trabalho": "O desenvolvimento seguirá a estrutura de código modular, dividindo as responsabilidades entre os diretórios `src` e `rest`. Após o desenvolvimento, a API será integrada a uma pipeline de CI/CD para rodar testes automatizados usando Supertest, Mocha e Chai.",
    "Ferramentas_necessárias": {
      "Tecnologias": [
        "Javascript",
        "Express.js"
      ],
      "Documentacao": "Swagger",
      "Autenticacao": "JSON Web Tokens (JWT)"
    }
  },
  "Recursos": {
    "User": {
      "Endpoints": [
        "POST /auth/register",
        "POST /auth/login"
      ],
      "Regras": [
        "Não permitir registro de e-mails duplicados.",
        "A rota de login deve retornar um JWT em caso de sucesso."
      ]
    },
    "Task": {
      "Endpoints": [
        "POST /tasks",
        "GET /tasks",
        "PUT /tasks/:id"
      ],
      "Regras": [
        "Todas as rotas de tarefas devem ser protegidas por autenticação JWT.",
        "Um usuário pode manipular apenas as suas próprias tarefas (autorização)."
      ]
    }
  },
  "Estrutura_do_Projeto": {
    "Banco_de_Dados": {
      "Tipo": "Em memória (variáveis e arrays)",
      "Responsabilidade": "Manter os dados de usuários e tarefas temporariamente."
    },
    "Diretorios": {
      "src": "Contém a lógica de negócio principal, incluindo `models` e `services`.",
      "rest": "Contém a camada de roteamento, incluindo `controllers`, `routes`, `swagger` e `middleware`."
    },
    "Arquivos": {
      "app.js": "Contém a lógica da aplicação e as rotas, sem o método listen(), para permitir testes com Supertest.",
      "server.js": "Importa app.js e inicia o servidor HTTP."
    },
    "Documentacao": {
      "README.md": "Documentar a configuração e operação da API."
    }
  },
  "Consideracoes_de_Desenvolvimento": [
    "1. **Modularidade:** A lógica de autenticação (JWT) deve ser implementada em um middleware separado para ser reutilizada em todas as rotas de tarefas.",
    "2. **Segurança:** A validação do token JWT deve ser robusta, garantindo que apenas usuários autenticados e autorizados possam acessar os recursos de tarefas.",
    "3. **Código Limpo:** Priorizar código limpo, bem comentado e seguindo as melhores práticas de desenvolvimento, o que facilitará a adição de testes no futuro.",
    "4. **Foco:** O objetivo principal é demonstrar as habilidades de autenticação e organização de projeto para testes, por isso, a aplicação não precisa ser completa (ex: pode-se omitir o endpoint de exclusão de tarefas)."
  ]
}
```

## Refatorações e Melhorias

Após a geração inicial do código, foram aplicadas as seguintes melhorias:

1.  **Reorganização Estrutural:** Os arquivos `app.js` e `server.js` foram movidos da raiz `/` para o diretório `rest/` para aprimorar a modularidade e a separação de responsabilidades do projeto.
2.  **Boas Práticas de Versionamento:** Foi adicionado um arquivo `.gitignore` para garantir que arquivos desnecessários, como a pasta `node_modules`, não fossem incluídos no controle de versão.
3.  **Padronização da Autenticação:** O middleware de autenticação (`auth.js`) foi ajustado para utilizar o cabeçalho `Authorization: Bearer`, seguindo o padrão de mercado para envio de tokens JWT e garantindo maior interoperabilidade.


## Funcionalidades

- Registro e Login de usuários com autenticação JWT.
- CRUD de tarefas (Criar, Ler, Atualizar).
- Autorização: cada usuário só gerencia suas próprias tarefas.
- Documentação da API com Swagger.
- Testes automatizados com Supertest, Mocha e Chai (pipeline CI/CD).


## Estrutura do Projeto

```
api-gerenciador-tarefas/
├── src/                # Lógica de negócio, modelos e serviços
│   ├── models/         # Modelos de dados (User, Task)
│   └── services/       # Serviços de negócio (userService, taskService)
├── rest/               # Rotas, controladores, middlewares e Swagger
│   ├── controllers/    # Controllers REST
│   ├── middleware/     # Middleware de autenticação JWT
│   ├── routes/         # Rotas REST
│   ├── swagger/        # Documentação Swagger
│   ├── app.js          # App Express (sem listen)
│   └── server.js       # Inicialização do servidor REST
├── graphql/            # API GraphQL (typeDefs, resolvers, autenticação)
│   ├── typeDefs.js     # Schema GraphQL
│   ├── resolvers.js    # Resolvers GraphQL
│   ├── authenticate.js # Middleware GraphQL
│   ├── app.js          # App Apollo Server
│   └── server.js       # Inicialização do servidor GraphQL
├── test/               # Testes automatizados
│   ├── integration/    # Testes de integração (REST e GraphQL)
│   ├── unit/           # Testes unitários
├── .github/workflows/  # Pipeline CI/CD (GitHub Actions)
├── package.json        # Dependências e scripts
├── README.md           # Documentação
└── .env                # Variáveis de ambiente
```

Banco de dados: em memória (arrays), apenas para fins didáticos/testes.


## Como Executar a API

1. **Instale as dependências:**
  ```bash
  npm install
  ```

2. **Inicie o servidor REST:**
  ```bash
  npm run start-rest
  ```

3. **Inicie o servidor GraphQL:**
  ```bash
  npm run start-graphql
  ```

4. **Acesse a documentação Swagger:**
  ```
  http://localhost:3000/api-docs
  ```

## Como Executar os Testes

Os testes automatizados utilizam Mocha, Chai, Supertest e Sinon. Para rodar todos os testes:

```bash
npm test
```

Para rodar testes específicos:

- Testes unitários:
  ```bash
  npm run test-unit
  ```
- Testes de controllers REST:
  ```bash
  npm run test-rest-controller
  ```
- Testes externos REST (via HTTP):
  ```bash
  npm run test-rest-external
  ```
- Testes de integração GraphQL:
  ```bash
  npm run test-graphql
  ```

Os relatórios de testes são gerados em `mochawesome-report/`.

## Integração Contínua (CI)

O projeto utiliza GitHub Actions para rodar os testes automaticamente a cada push ou pull request na branch `main`. O workflow está definido em `.github/workflows/ci.yml` e executa:

- Instalação das dependências
- Inicialização dos servidores REST e GraphQL
- Execução dos testes unitários, controllers, externos REST e integração GraphQL
- Geração de relatórios Mochawesome

As variáveis de ambiente são configuradas via `secrets` do GitHub.

## Sobre

Este projeto foi desenvolvido para a disciplina de Pós-graduação em Automação de Testes de Software | PGATS-2025-02.

---
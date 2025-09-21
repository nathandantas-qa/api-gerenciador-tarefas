const request = require('supertest');
const sinon = require('sinon');
const { expect } = require('chai');

// Aplicação
const app = require('../../../../rest/app');

// Mock
const taskService = require('../../../../src/services/taskService');

// Fixture
const postTask = require('../fixture/requisicoes/task/postTask.json');
const putTaskSuccess = require('../fixture/requisicoes/task/putTask_success.json');
const putTaskUnauthorized = require('../fixture/requisicoes/task/putTask_unauthorized.json');
const postLogin_StandardUsers = require('../fixture/requisicoes/login/postLogin_StandardUsers.json');
const postLogin_ReadOnlyUsers = require('../fixture/requisicoes/login/postLogin_ReadOnlyUsers.json');
const respostaCriarTarefa = require('../fixture/respostas/deveCriarUmaNovaTarefaParaOUsuarioAutenticado.json');
const respostaTodasTarefas = require('../fixture/respostas/deveRetornarTodasAsTarefasDoUsuarioAutenticado.json');
const respostaAtualizarTarefa = require('../fixture/respostas/deveAtualizarUmaTarefaParaOUsuarioAutenticado.json');
const respostaForbidden = require('../fixture/respostas/naoDevePermitirQueUmUsuarioAtualizeUmaTarefaQueNaoESua.json');

describe('Integração Task Controller', () => {
  let token;
  let secondaryToken;
  let sandbox;

  before( async () => {
    // Login do usuário padrão
    const respostaLogin = await request(app)
      .post('/auth/login')
      .send(postLogin_StandardUsers[0]);
    token = respostaLogin.body.token;

    // Login do usuário secundário
    const respostaLoginSec = await request(app)
      .post('/auth/login')
      .send(postLogin_ReadOnlyUsers[0]);
    secondaryToken = respostaLoginSec.body.token;

  })

  beforeEach(async () => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sinon.restore();
    sandbox.restore();
  });

  it('não deve permitir acesso às tarefas sem um token', async () => {
    const resposta = await request(app)
      .get('/tasks');
    expect(resposta.status).to.equal(403);
  });

  it('deve criar uma nova tarefa para o usuário autenticado', async () => {

    const createTaskStub = sandbox.stub(taskService, 'createTask').returns(respostaCriarTarefa);

    const resposta = await request(app)
      .post('/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send(postTask);

    expect(createTaskStub.calledOnce).to.be.true;
    expect(resposta.status).to.equal(201);
    expect(resposta.body).to.have.property('id');
    expect(resposta.body.title).to.equal('Tarefa Teste');
  });

  it('deve retornar todas as tarefas do usuário autenticado', async () => {
    
    const findTasksStub = sandbox.stub(taskService, 'findTasksByUserId');
    findTasksStub.withArgs(respostaTodasTarefas[0].userId).returns(respostaTodasTarefas);
    const primaryUserID = respostaTodasTarefas[0].userId;
    
    const respostaPrimaryUser = await request(app)
      .get('/tasks')
      .set('Authorization', `Bearer ${token}`);

    expect(respostaPrimaryUser.status).to.equal(200);
    expect(respostaPrimaryUser.body).to.be.an('array');
    expect(respostaPrimaryUser.body.length).to.greaterThanOrEqual(2);

    const taskExists = respostaPrimaryUser.body.every(task => task.userId === primaryUserID);
    expect(taskExists).to.be.true;

    // Usuário secundário
    const tasksSecondarysDummy = [
      { id: 3, title: 'Tarefa Secundária', description: 'Só do secundário', userId: 2, completed: false }
    ];

    findTasksStub.withArgs(tasksSecondarysDummy[0].userId).returns(tasksSecondarysDummy);
    

    const respostaSecondaryUser = await request(app)
      .get('/tasks')
      .set('Authorization', `Bearer ${secondaryToken}`);

    expect(respostaSecondaryUser.status).to.equal(200);
    expect(respostaSecondaryUser.body).to.be.an('array');
    expect(respostaSecondaryUser.body.length).to.equal(1);

    const noTasksLeakedToSecondaryUser = respostaSecondaryUser.body.every(task => task.userId !== primaryUserID);
    expect(noTasksLeakedToSecondaryUser).to.be.true;

  });

  it('deve atualizar uma tarefa para o usuário autenticado', async () => {
    
    const updateTaskStub = sandbox.stub(taskService, 'updateTask').returns({
        success: true,
        data: respostaAtualizarTarefa
    });

    const resposta = await request(app)
      .put(`/tasks/${putTaskSuccess.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(putTaskSuccess.putTask);

    expect(updateTaskStub.calledOnce).to.be.true;
    expect(resposta.status).to.equal(200);
    expect(resposta.body).to.deep.equal(respostaAtualizarTarefa);

  });

  it('não deve permitir que um usuário atualize uma tarefa que não é sua', async () => {
    const updateTaskStub = sandbox.stub(taskService, 'updateTask').returns(respostaForbidden);

    const resposta = await request(app)
      .put(`/tasks/${putTaskUnauthorized.id}`)
      .set('Authorization', `Bearer ${secondaryToken}`)
      .send(putTaskUnauthorized.putTask);

    expect(updateTaskStub.calledOnce).to.be.true;
    expect(resposta.status).to.equal(403);
    expect(resposta.body).to.have.property('message', 'Forbidden');


  });


  it('deve retornar 400 se o título estiver ausente ao criar tarefa', async () => {
    const resposta = await request(app)
      .post('/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ description: 'Descrição sem título' });

    expect(resposta.status).to.equal(400);
    expect(resposta.body).to.have.property('message', 'Title is required');
  });
});

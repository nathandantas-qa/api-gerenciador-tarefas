const request = require('supertest');
const { expect } = require('chai');
const jwt = require('jsonwebtoken'); // 1. Importe a biblioteca JWT
require('dotenv').config();

const api = request(process.env.API_BASE_URL);
const postLogin_StandardUsers = require('../fixture/requisicoes/login/postLogin_StandardUsers.json');
const postLogin_ReadOnlyUsers = require('../fixture/requisicoes/login/postLogin_ReadOnlyUsers.json');

describe('API de Tarefas', () => {
  let token;
  
  let primaryUserToken;
  let secondaryUserToken;
  let userPrimaryId;

  before( async () => {
    const primaryUser = postLogin_StandardUsers[0];
    const secondaryUser = postLogin_ReadOnlyUsers[0];


    const primaryRes = await api.post('/auth/login').send(primaryUser);
    primaryUserToken = primaryRes.body.token;
    
      
    const decodedToken = jwt.decode(primaryUserToken);
    userPrimaryId = decodedToken.id;
    

    const secondaryRes = await api.post('/auth/login').send(secondaryUser);
    secondaryUserToken = secondaryRes.body.token;
  
    
  });

  it('não deve permitir acesso às tarefas sem um token', async () => {
    const resposta = await api.get('/tasks');
    
    expect(resposta.status).to.equal(403);
  });

  it('deve criar uma nova tarefa para o usuário autenticado', async () => {
    const postTask = require('../fixture/requisicoes/task/postTask.json');
    
    const resposta = await api.post('/tasks')
      .set('Authorization', `Bearer ${primaryUserToken}`)
      .send(postTask);

      expect(resposta.status).to.equal(201);
      expect(resposta.body).to.have.property('id');
      expect(resposta.body.title).to.equal('Tarefa Teste');
  });

  it('deve retornar todas as tarefas do usuário autenticado', async () => {
    
    const respostaPrimaryUser = await api.get('/tasks')
      .set('Authorization', `Bearer ${primaryUserToken}`);

    const respostaSecondaryUser = await api.get('/tasks')
      .set('Authorization', `Bearer ${secondaryUserToken}`);
    

    expect(respostaPrimaryUser.status).to.equal(200);
    expect(respostaPrimaryUser.body).to.be.an('array'); // Verifica se é um array,não podendo retornar null, dever ser vazio  []
    expect(respostaPrimaryUser.body.length).to.greaterThanOrEqual(2)
    
    expect(respostaSecondaryUser.status).to.equal(200);
    expect(respostaSecondaryUser.body).to.be.an('array');
    expect(respostaSecondaryUser.body.length).to.equal(1);

    // Verifica se a lista do usuário principal contém apenas as suas próprias tarefas.
    const taskExists = respostaPrimaryUser.body.every(task => task.userId === userPrimaryId );
    expect(taskExists, 'Todas as tarefas do usuário principal devem pertencer a ele').to.be.true;
    
    // Garante que nenhuma tarefa do usuário principal vazou para a lista do secundário.
    const noTasksLeakedToSecondaryUser = respostaSecondaryUser.body.every(task => task.userId !== userPrimaryId);
    expect(noTasksLeakedToSecondaryUser,'Todas as tarefas do usuário secundario devem pertencer a ele').to.be.true;

  });        

  it('deve atualizar uma tarefa para o usuário autenticado', async () => {
    const successUpdateTask = require('../fixture/requisicoes/task/putTask_success.json');

    const resposta = await api.put(`/tasks/${successUpdateTask.id}`)
      .set('Authorization', `Bearer ${primaryUserToken}`)
      .send(successUpdateTask.putTask);

    expect(resposta.status).to.equal(200);
    expect(resposta.body.title).to.equal('Atualizando Task');
    expect(resposta.body.completed).to.be.false;
  });

  it('não deve permitir que um usuário atualize uma tarefa que não é sua', async () => {
    const unauthorizedUpdateTask = require('../fixture/requisicoes/task/putTask_unauthorized.json');
    

    const resposta = await api.put(`/tasks/${unauthorizedUpdateTask.id}`)
      .set('Authorization', `Bearer ${secondaryUserToken}`)
      .send(unauthorizedUpdateTask.putTask);

    expect(resposta.status).to.equal(403);
    
  });   
});

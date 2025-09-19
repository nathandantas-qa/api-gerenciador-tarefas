const request = require('supertest');
const { expect } = require('chai');
require('dotenv').config();


const api = request(process.env.API_BASE_URL);
const postLogin = require('../fixture/requisicoes/login/postLogin.json');

describe('API de Tarefas', () => {
  let token;
  let taskId;

  before( async () => {
    const res = await api.post('/auth/login').send(postLogin[0]);
    token = res.body.token;  
    
  });

  it('não deve permitir acesso às tarefas sem um token', async () => {
    const resposta = await api.get('/tasks');
    
    expect(resposta.status).to.equal(403);
  });

  it('deve criar uma nova tarefa para o usuário autenticado', async () => {
    const postTask = require('../fixture/requisicoes/task/postTask.json');
    
    const resposta = await api.post('/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send(postTask);

      expect(resposta.status).to.equal(201);
      expect(resposta.body).to.have.property('id');
      expect(resposta.body.title).to.equal('Tarefa Teste');
  });

  it('deve retornar todas as tarefas do usuário autenticado', async () => {
    const res2 = await api.post('/auth/login').send(postLogin[1]);
    const token2 = res2.body.token;  
    
    const resposta = await api.get('/tasks')
      .set('Authorization', `Bearer ${token2}`);

    expect(resposta.status).to.equal(200);
    expect(resposta.body).to.be.an('array');
    expect(resposta.body.length).to.equal(1);
  });        

  it('deve atualizar uma tarefa para o usuário autenticado', async () => {
    const putTask = require('../fixture/requisicoes/task/putTask.json');

    const resposta = await api.put(`/tasks/${putTask.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(  putTask.putTask );

    expect(resposta.status).to.equal(200);
    expect(resposta.body.title).to.equal('Atualizando Task');
    expect(resposta.body.completed).to.be.true;
  });

  it('não deve permitir que um usuário atualize uma tarefa que não é sua', async () => {
    const putTaskWithError = require('../fixture/requisicoes/task/putTaskWithError.json');

    const res2 = await api.post('/auth/login').send(postLogin[1]);
    taskId = res2.body.id;

    const resposta = await api.put(`/tasks/${putTaskWithError.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(putTaskWithError.putTask);

    expect(resposta.status).to.equal(403);
    
  });   
});

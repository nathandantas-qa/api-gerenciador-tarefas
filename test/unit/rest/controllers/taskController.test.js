const chai = require('chai');
const sinon = require('sinon');
const taskService = require('../../../../src/services/taskService');
const { createTask, getTasks, updateTask } = require('../../../../rest/controllers/taskController');

// Fixtures
const createTaskPayload = require('../fixture/task/createTask_payload.json');
const createTaskResponse = require('../fixture/task/createTask_response.json');
const getTasksResponse = require('../fixture/task/getTasks_response.json');
const updateTaskPayload = require('../fixture/task/updateTask_payload.json');
const updateTaskResponse = require('../fixture/task/updateTask_response.json');
const updateTaskError = require('../fixture/task/updateTask_error.json');


const { expect } = chai;

describe('Teste de unidade para o Task Controller', () => {
  let req, res, sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    req = {
      body: {},
      params: {},
      userId: 1,
    };
    res = {
      status: sinon.stub().returnsThis(),
      send: sinon.spy(),
    };
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('createTask', () => {
    it('deve criar uma tarefa e retornar 201', () => {
      req.body = createTaskPayload;
      
      const createTaskStub =  sandbox.stub(taskService, 'createTask').returns(createTaskResponse);

      createTask(req, res);
      
      expect(createTaskStub.calledOnce).to.be.true;
      
      expect(createTaskStub.calledWith(
        createTaskPayload.title, 
        createTaskPayload.description, 
        req.userId 
      )).to.be.true;


      expect(res.status.calledWith(201)).to.be.true;
      expect(res.send.calledWith(createTaskResponse)).to.be.true;
    });

    it('deve retornar 400 se o título estiver ausente', () => {
      req.body = { description: 'Test Description' };

      createTask(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.send.calledWith({ message: 'Title is required' })).to.be.true;
    });
  });

  describe('getTasks', () => {
    it('deve retornar 200 e todas as tarefas de um usuário', () => {
      sandbox.stub(taskService, 'findTasksByUserId').returns(getTasksResponse);

      getTasks(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.send.calledWith(getTasksResponse)).to.be.true;
    });
  });

  describe('updateTask', () => {
    it('deve atualizar uma tarefa e retornar 200', () => {
      req.params.id = '1';
      req.body = updateTaskPayload;
      sandbox.stub(taskService, 'updateTask').returns({ success: true, data: updateTaskResponse });

      updateTask(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.send.calledWith(updateTaskResponse)).to.be.true;
    });

    it('deve retornar um erro se a atualização da tarefa falhar', () => {
      req.params.id = '1';
      req.body = { title: 'Updated Task' };
      sandbox.stub(taskService, 'updateTask').returns(updateTaskError);

      updateTask(req, res);

      expect(res.status.calledWith(updateTaskError.status)).to.be.true;
      expect(res.send.calledWith({ message: updateTaskError.message })).to.be.true;
    });
  });
});

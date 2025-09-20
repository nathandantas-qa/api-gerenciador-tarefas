const chai = require('chai');
const sinon = require('sinon');
const taskService = require('../../../../src/services/taskService');
const { createTask, getTasks, updateTask } = require('../../../../rest/controllers/taskController');

const { expect } = chai;

describe('Unit Test Task Controller', () => {
  let requisicao, resposta, sandbox;

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
    it('should create a task and return 201', () => {
      req.body = { title: 'Test Task', description: 'Test Description' };
      const task = { id: 1, ...req.body, userId: req.userId, completed: false };
      sandbox.stub(taskService, 'createTask').returns(task);

      createTask(req, res);

      expect(res.status.calledWith(201)).to.be.true;
      expect(res.send.calledWith(task)).to.be.true;
    });

    it('should return 400 if title is missing', () => {
      req.body = { description: 'Test Description' };

      createTask(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.send.calledWith({ message: 'Title is required' })).to.be.true;
    });
  });

  describe('getTasks', () => {
    it('should get all tasks for a user and return 200', () => {
      const tasks = [{ id: 1, title: 'Test Task', description: 'Test Description', userId: req.userId, completed: false }];
      sandbox.stub(taskService, 'findTasksByUserId').returns(tasks);

      getTasks(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.send.calledWith(tasks)).to.be.true;
    });
  });

  describe('updateTask', () => {
    it('should update a task and return 200', () => {
      req.params.id = '1';
      req.body = { title: 'Updated Task', description: 'Updated Description', completed: true };
      const updatedTask = { id: 1, ...req.body, userId: req.userId };
      sandbox.stub(taskService, 'updateTask').returns({ success: true, data: updatedTask });

      updateTask(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.send.calledWith(updatedTask)).to.be.true;
    });

    it('should return an error if the task update fails', () => {
      req.params.id = '1';
      req.body = { title: 'Updated Task' };
      const error = { success: false, status: 404, message: 'Task not found' };
      sandbox.stub(taskService, 'updateTask').returns(error);

      updateTask(req, res);

      expect(res.status.calledWith(error.status)).to.be.true;
      expect(res.send.calledWith({ message: error.message })).to.be.true;
    });
  });
});

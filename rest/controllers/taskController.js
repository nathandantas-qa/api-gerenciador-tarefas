const taskService = require('../../src/services/taskService');

const createTask = (req, res) => {
  const { title, description } = req.body;
  if (!title) {
    return res.status(400).send({ message: 'Title is required' });
  }
  const task = taskService.createTask(title, description, req.userId);
  res.status(201).send(task);
};

const getTasks = (req, res) => {
  const tasks = taskService.findTasksByUserId(req.userId);
  res.status(200).send(tasks);
};

const updateTask = (req, res) => {
  const taskId = parseInt(req.params.id);
  const { title, description, completed } = req.body;
  const userId = req.userId;

  const result = taskService.updateTask(taskId, userId, title, description, completed);

  if (!result.success) {
    return res.status(result.status).send({ message: result.message });
  }

  res.status(200).send(result.data);
};

module.exports = {
  createTask,
  getTasks,
  updateTask
};

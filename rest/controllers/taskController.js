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

  const task = taskService.findTaskById(taskId);

  if (!task) {
    return res.status(404).send({ message: 'Task not found' });
  }

  if (task.userId !== req.userId) {
    return res.status(403).send({ message: 'You are not authorized to update this task' });
  }

  const updatedTask = taskService.updateTask(taskId, title, description, completed);
  res.status(200).send(updatedTask);
};

module.exports = {
  createTask,
  getTasks,
  updateTask
};

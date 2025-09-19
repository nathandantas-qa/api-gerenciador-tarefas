const { tasks, Task } = require('../models/task');
let idCounter = 1;

const createTask = (title, description, userId) => {
  const newTask = new Task(idCounter++, title, description, userId);
  tasks.push(newTask);
  return newTask;
};

const findTasksByUserId = (userId) => {
  return tasks.filter(task => task.userId === userId);
};

const findTaskById = (id) => {
  return tasks.find(task => task.id === id);
};

const updateTask = (id, title, description, completed) => {
  const task = findTaskById(id);
  if (task) {
    task.title = title !== undefined ? title : task.title;
    task.description = description !== undefined ? description : task.description;
    task.completed = completed !== undefined ? completed : task.completed;
    return task;
  }
  return null;
};

module.exports = {
  createTask,
  findTasksByUserId,
  findTaskById,
  updateTask
};

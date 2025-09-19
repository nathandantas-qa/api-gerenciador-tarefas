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

const updateTask = (id, userId, title, description, completed) => {
  const task = findTaskById(id);
  if (!task) {
    return { success: false, status: 404, message: 'Task not found' };
  }

  if (task.userId !== userId) {
    return { success: false, status: 403, message: 'You are not authorized to update this task' };
  }

  task.title = title !== undefined ? title : task.title;
  task.description = description !== undefined ? description : task.description;
  task.completed = completed !== undefined ? completed : task.completed;
  
  return { success: true, data: task };
};

module.exports = {
  createTask,
  findTasksByUserId,
  findTaskById,
  updateTask
};

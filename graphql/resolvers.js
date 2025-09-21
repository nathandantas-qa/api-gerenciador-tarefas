const jwt = require('jsonwebtoken');
const authenticateUser = require('./authenticate');
const taskService = require('../src/services/taskService');


const resolvers = {
  Query: {
    tasks: (parent, args, context) => {
      if (!context.user) throw new Error('Authentication required');
      return taskService.getTasksByUserId(context.user.id);
    },
  },
  Mutation: {
    registerUser: (parent, { email, password }) => {
      if (taskService.findUserByEmail(email)) {
        throw new Error('Email already exists');
      }
      return taskService.createUser(email, password);
    },
    loginUser: (parent, { email, password }) => {
      const user = taskService.findUserByEmail(email);
      if (!user || user.password !== password) {
        throw new Error('Invalid credentials');
      }
      const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
      return { token, user: { id: user.id, email: user.email } };
    },
    createTask: (parent, { title, description }, context) => {
      if (!context.user) throw new Error('Authentication required');
      if (!title) throw new Error('Title is required');
      const task = {
        id: taskIdCounter++,
        title,
        description,
        userId: context.user.id,
        completed: false
      };
      tasks.push(task);
      return task;
    },
    updateTask: (parent, { id, title, description, completed }, context) => {
      if (!context.user) throw new Error('Authentication required');
      const task = tasks.find(t => t.id == id && t.userId === context.user.id);
      if (!task) throw new Error('Task not found or unauthorized');
      if (title !== undefined) task.title = title;
      if (description !== undefined) task.description = description;
      if (completed !== undefined) task.completed = completed;
      return task;
    },
  },
};

module.exports = resolvers;

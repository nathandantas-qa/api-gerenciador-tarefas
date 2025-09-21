const jwt = require('jsonwebtoken');
const authenticateUser = require('./authenticate');
const userService = require('../src/services/userService');
const taskService = require('../src/services/taskService');


const resolvers = {
  Query: {
    tasks: (parent, args, context) => {
      if (!context.user) throw new Error('Authentication required');
      return taskService.findTasksByUserId(context.user.id);
    },
  },
  Mutation: {
    registerUser: (parent, { email, password }) => {
      const user = userService.createUser(email, password);
      if (!user) throw new Error('Email already exists');
      return { id: user.id, email: user.email };
    },
    loginUser: (parent, { email, password }) => {
      const result = userService.authenticateUser(email, password);
      if (!result.success) throw new Error(result.message);
      const user = userService.findUserByEmail(email);
      return { token: result.token, user: { id: user.id, email: user.email } };
    },
    createTask: (parent, { title, description }, context) => {
      if (!context.user) throw new Error('Authentication required');
      if (!title) throw new Error('Title is required');
      return taskService.createTask(title, description, context.user.id);
    },
    updateTask: (parent, { id, title, description, completed }, context) => {
      if (!context.user) throw new Error('Authentication required');
      const result = taskService.updateTask(parseInt(id), context.user.id, title, description, completed);
      if (!result.success) throw new Error(result.message);
      return result.data;
    },
  },
};

module.exports = resolvers;

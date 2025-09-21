const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');
const authenticateUser = require('./authenticate');

const app = express();
app.use(express.json());

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.headers.authorization ? req.headers.authorization.replace('Bearer ', '') : null;
    const user = authenticateUser(token);
    return { user };
  },
});

module.exports = { app, server };

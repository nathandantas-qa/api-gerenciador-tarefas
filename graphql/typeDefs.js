const { gql } = require('apollo-server-express');

module.exports = gql`
  type User {
    id: ID!
    email: String!
  }

  type Task {
    id: ID!
    title: String!
    description: String
    userId: ID!
    completed: Boolean!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    tasks: [Task!]!
  }

  type Mutation {
    registerUser(email: String!, password: String!): User!
    loginUser(email: String!, password: String!): AuthPayload!
    createTask(title: String!, description: String): Task!
    updateTask(id: ID!, title: String, description: String, completed: Boolean): Task!
  }
`;

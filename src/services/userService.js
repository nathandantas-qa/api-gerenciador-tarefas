const { users, User } = require('../models/user');
const bcrypt = require('bcryptjs');

let idCounter = 1;

const createUser = (email, password) => {
  if (users.find(user => user.email === email)) {
    return null; // Email já existe
  }
  const hashedPassword = bcrypt.hashSync(password, 8);
  const newUser = new User(idCounter++, email, hashedPassword);
  users.push(newUser);
  return newUser;
};

const findUserByEmail = (email) => {
  return users.find(user => user.email === email);
};

module.exports = {
  createUser,
  findUserByEmail
};

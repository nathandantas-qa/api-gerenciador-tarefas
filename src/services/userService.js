const { users, User } = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

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

const authenticateUser = (email, password) => {
  const user = findUserByEmail(email);
  
  if (!user) {
    return { success: false, status: 401, message: 'Invalid email or password' };
  }
  
  const passwordIsValid = bcrypt.compareSync(password, user.password);
  if (!passwordIsValid) {
    return { success: false, status: 401, message: 'Invalid email or password' };
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: 86400 // 24 hours
  });

  return { success: true, token };
};

module.exports = {
  createUser,
  findUserByEmail,
  authenticateUser
};

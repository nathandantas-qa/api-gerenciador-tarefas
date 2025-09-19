const userService = require('../../src/services/userService');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const register = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send({ message: 'Email and password are required' });
  }

  const user = userService.createUser(email, password);
  if (!user) {
    return res.status(409).send({ message: 'Email already exists' });
  }

  res.status(201).send({ id: user.id, email: user.email });
};

const login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send({ message: 'Email and password are required' });
  }

  const user = userService.findUserByEmail(email);
  if (!user) {
    return res.status(401).send({ message: 'Invalid email or password' });
  }

  const passwordIsValid = bcrypt.compareSync(password, user.password);
  if (!passwordIsValid) {
    return res.status(401).send({ message: 'Invalid email or password' });
  }

  const token = jwt.sign({ id: user.id }, 'supersecret', {
    expiresIn: 86400 // 24 hours
  });

  res.status(200).send({ auth: true, token: token });
};

module.exports = {
  register,
  login
};

const userService = require('../../src/services/userService');

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

  const result = userService.authenticateUser(email, password);

  if (!result.success) {
    return res.status(result.status).send({ message: result.message });
  }

  res.status(200).send({ auth: true, token: result.token });
};

module.exports = {
  register,
  login
};

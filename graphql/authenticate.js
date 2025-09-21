const jwt = require('jsonwebtoken');
require('dotenv').config();

function authenticateUser(token) {
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return { id: decoded.id, email: decoded.email };
  } catch (err) {
    return null;
  }
}

module.exports = authenticateUser;

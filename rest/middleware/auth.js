const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
  
  const authorization = req.headers['authorization'];
  if (!authorization) {
    return res.status(403).send({ auth: false, message: 'No token provided.' });
  }

  const parts = authorization.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).send({ auth: false, message: 'Invalid token format.' });
  }
  
  const token = parts[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    
    if (err) {
      console.log(err);
      return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    }

    // if everything good, save to request for use in other routes
    req.userId = decoded.id;
    next();
  });
};

module.exports = verifyToken;

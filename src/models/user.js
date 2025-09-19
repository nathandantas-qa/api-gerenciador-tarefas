const bcrypt = require('bcryptjs');

const users = [{
    id: 1,
    email: 'user@example.com',
    password: bcrypt.hashSync('123456', 8)
  },{
    id: 2,
    email: 'user2@example.com',
    password: bcrypt.hashSync('123456', 8)    
  }
];

let idCounter = 3;

class User {
  constructor(id, email, password) {
    this.id = id;
    this.email = email;
    this.password =  password;
  }
}

module.exports = {
  users,
  idCounter,
  User
};

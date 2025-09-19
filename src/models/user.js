// Em memória, os usuários serão armazenados em um array
const users = [];
let idCounter = 1;

class User {
  constructor(id, email, password) {
    this.id = id;
    this.email = email;
    this.password = password;
  }
}

module.exports = {
  users,
  idCounter,
  User
};

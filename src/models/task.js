// Em memória, as tarefas serão armazenadas em um array
const tasks = [];
let idCounter = 1;

class Task {
  constructor(id, title, description, userId) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.userId = userId;
    this.completed = false;
  }
}

module.exports = {
  tasks,
  idCounter,
  Task
};

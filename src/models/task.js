// Em memória, as tarefas serão armazenadas em um array
const tasks = [
  {
    id: 1,
    title: 'Tarefa teste',
    description: 'Esta é uma tarefa de teste',
    userId: 1,
    completed: false
  },{
    id: 2,
    title: 'Outra tarefa',
    description: 'Esta é outra tarefa',
    userId: 2,
    completed: true
  }
  
];
let idCounter = 3;

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

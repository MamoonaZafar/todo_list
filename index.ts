import inquirer from 'inquirer';
import fs from 'fs';
import figlet from 'figlet';

interface TodoItem {
  text: string;
  completed: boolean;
}

interface TodoList {
  items: TodoItem[];
}

const todoListPath = './todo-list.json';

let todoList: TodoList = { items: [] };

function saveTodoList(): void {
  fs.writeFileSync(todoListPath, JSON.stringify(todoList));
}

function loadTodoList(): void {
  try {
    const data = fs.readFileSync(todoListPath);
    todoList = JSON.parse(data.toString());
  } catch (e) {
    console.error('Failed to load todo list');
  }
}

function addTodoItem(): void {
  inquirer.prompt({ type: 'input', name: 'text', message: 'Enter todo item:' })
    .then(answers => {
      todoList.items.push({ text: answers.text, completed: false });
      saveTodoList();
      console.log('Todo item added!');
      showMainMenu();
    });
}

function completeTodoItem(): void {
  inquirer.prompt({
    type: 'list',
    name: 'item',
    message: 'Select item to complete:',
    choices: todoList.items.map(item => ({ name: item.text, value: item }))
  }).then(answers => {
    const selectedItem = answers.item;
    selectedItem.completed = true;
    saveTodoList();
    console.log('Todo item completed!');
    showMainMenu();
  });
}

function showTodoList(): void {
  console.log('\nTodo List:\n');
  todoList.items.forEach(item => {
    const status = item.completed ? '[x]' : '[ ]';
    console.log(`${status} ${item.text}`);
  });
  showMainMenu();
}

function showMainMenu(): void {
  inquirer.prompt({
    type: 'list',
    name: 'menu',
    message: 'Select an option:',
    choices: [
      { name: 'Add todo item', value: addTodoItem },
      { name: 'Complete todo item', value: completeTodoItem },
      { name: 'Show todo list', value: showTodoList },
      { name: 'Exit', value: null }
    ]
  }).then(answers => {
    if (answers.menu) {
      answers.menu();
    }
  });
}

figlet('Todo App', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  console.log(data);
  loadTodoList();
  showMainMenu();
});

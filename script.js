"use strict";
//Select DOM
var todoInput = document.querySelector(".todo-input");
var todoButton = document.querySelector(".todo-button");
var todoList = document.querySelector(".todo-list");
var filterOption = document.querySelector(".filter-todo");

//* Event Listener
window.addEventListener("load", getTodos);
todoButton.addEventListener("click", addTodo);
todoList.addEventListener("click", completeOrDelete);
filterOption.addEventListener("click", filterTodo);
//* functions

//! Add elements to the Todo Div
function createTodo(todoInputValue) {
  var todoDiv = document.createElement("div");
  todoDiv.classList.add("todo");
  var newTodo = createNewTodoListItem(todoInputValue);
  todoDiv.appendChild(newTodo);

  //check Mark Button
  var completedButton = createCheckMarkButton();
  todoDiv.appendChild(completedButton);

  //Trash Button
  var trashButton = createTrashButton();
  todoDiv.appendChild(trashButton);

  //Append to ul
  todoList.appendChild(todoDiv);
}

function addTodo(e) {
  e.preventDefault();

  createTodo();

  saveTodoToLocalStorage(todoInput.value);
  todoInput.value = "";
}

//!Create Elements of todo Div
function createNewTodoListItem(todoValue = todoInput.value) {
  var newTodo = document.createElement("li");
  newTodo.innerText = todoValue;
  newTodo.classList.add("todo-item");
  return newTodo;
}

// creating check mark btn
function createCheckMarkButton() {
  var completedButton = document.createElement("button");
  completedButton.innerHTML = '<i class="fas fa-check"></i>';
  completedButton.classList.add("complete-btn");
  return completedButton;
}

// creating delete button
function createTrashButton() {
  var trashButton = document.createElement("button");
  trashButton.innerHTML = '<i class="fas fa-trash"></i>';
  trashButton.classList.add("trash-btn");
  return trashButton;
}
//!---------------------------

// for complete or delete btn click
function completeOrDelete(e) {
  var item = e.target;
  // checking if the button clicked was delete btn
  if (item.classList[0] === "trash-btn") {
    var todo = item.parentElement;
    todo.classList.add("fall");
    removeTodoFromLocalStorage(todo);
    // waiting for the transition to end
    todo.addEventListener("transitionend", function () {
      todo.remove();
    });
  }

  // checking if the button clicked was complete btn
  if (item.classList[0] === "complete-btn") {
    var todo = item.parentElement;
    todo.classList.toggle("completed");
  }
}

// for filtering todos
function filterTodo(e) {
  var todos = todoList.childNodes;
  todos.forEach((todo) => {
    switch (e.target.value) {
      case "all":
        todo.style.display = "flex";
        break;

      case "completed":
        if (todo.classList.contains("completed")) todo.style.display = "flex";
        else todo.style.display = "none";
        break;

      case "uncompleted":
        if (!todo.classList.contains("completed")) todo.style.display = "flex";
        else todo.style.display = "none";
        break;
    }
  });
}

//! Working with Local Storage
function checkLocalStorage() {
  var todos;
  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }
  return todos;
}

function saveTodoToLocalStorage(todo) {
  var todos = checkLocalStorage();
  todos.push(todo);
  localStorage.setItem("todos", JSON.stringify(todos));
}

function getTodos() {
  var todos = checkLocalStorage();

  todos.forEach((todo) => {
    createTodo(todo);
  });
}

function removeTodoFromLocalStorage(todo) {
  var todos = checkLocalStorage();

  var todoValue = todo.children[0].innerText;
  todos.splice(todos.indexOf(todoValue), 1);
  localStorage.setItem("todos", JSON.stringify(todos));
}

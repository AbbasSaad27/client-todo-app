"use strict";
//Select DOM
var todoInput = document.querySelector(".todo-input");
var todoButton = document.querySelector(".todo-button");
var todoList = document.querySelector(".todo-list");
var filterOption = document.querySelector(".filter-todo");
var popupOverlay = document.querySelector(".overlay");
var confirmBtn = document.querySelector(".btn-confirm");
var cancelBtn = document.querySelector(".btn-cancel");

//* Event Listener
window.addEventListener("load", getTodos);
todoButton.addEventListener("click", addTodo);
todoList.addEventListener("click", completeOrDelete);
filterOption.addEventListener("click", filterTodo);
cancelBtn.addEventListener("click", removePopup);
confirmBtn.addEventListener("click", deleteTodo);
//* functions

//! Add elements to the Todo Div
function createTodo(todoInputValue, id) {
  var todoDiv = document.createElement("div");
  todoDiv.classList.add("todo");
  var newTodo = createNewTodoListItem(todoInputValue, id);
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

  var id = Math.random() * 1000;
  createTodo(todoInput.value, id);

  saveTodoToLocalStorage({ id: id, todoText: todoInput.value });
  todoInput.value = "";
}

//!Create Elements of todo Div
function createNewTodoListItem(todoValue = todoInput.value, id) {
  var newTodo = document.createElement("li");
  // creating the input for updating the task
  var newtodoInput = document.createElement("input");
  newtodoInput.type = "text";
  newtodoInput.value = todoValue;
  newtodoInput.dataset.id = id;
  newtodoInput.classList.add("update-task");

  // adding the event listener for monitoring changes and saving it
  newtodoInput.addEventListener("change", function () {
    var todos = checkLocalStorage();
    // finding the index so that
    var todoIndex = todos.findIndex(function (todo) {
      return todo.id == newtodoInput.getAttribute("data-id");
    });

    // creating new todo obj to replace the previous one
    var newTodoObj = { id: newtodoInput.id, todoText: newtodoInput.value };
    todos.splice(todoIndex, 1, newTodoObj);
    localStorage.setItem("todos", JSON.stringify(todos));
  });
  // appending the input to the list Item
  newTodo.appendChild(newtodoInput);
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
var todoToRemove;
function completeOrDelete(e) {
  var item = e.target;
  // checking if the button clicked was delete btn
  if (item.classList[0] === "trash-btn") {
    popupOverlay.classList.add("overlay-active");
    todoToRemove = item.parentElement;
  }

  // checking if the button clicked was complete btn
  if (item.classList[0] === "complete-btn") {
    var todo = item.parentElement;
    item.previousSibling
      .querySelector(".update-task")
      .classList.toggle("completed-text");
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
    // extracting values from the todo obj
    var todoText = todo.todoText;
    var id = todo.id;
    createTodo(todoText, id);
  });
}

function removeTodoFromLocalStorage(todo) {
  var todos = checkLocalStorage();

  // getting the id to find the correct todo to remove
  var todoId = todo.getAttribute("data-id");
  var todoIndex = todos.findIndex(function (todo) {
    return todo.id == todoId;
  });
  todos.splice(todoIndex, 1);
  localStorage.setItem("todos", JSON.stringify(todos));
}

// removing popup
function removePopup() {
  popupOverlay.classList.remove("overlay-active");
  todoToRemove = undefined;
}

// deleting todo
function deleteTodo() {
  // using the reference value that I set from the trash btn click event
  todoToRemove.classList.add("fall");
  var todoListItemInput = todoToRemove.querySelector(".update-task");
  removeTodoFromLocalStorage(todoListItemInput);
  // waiting for the transition to end
  todoToRemove.addEventListener("transitionend", function () {
    todoToRemove.remove();
  });
  popupOverlay.classList.remove("overlay-active");
}

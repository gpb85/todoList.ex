let todoList = [];
let highPriorityList = [];
let doneList = [];

loadFromLocaleStorage();

//unipue ID
function uniqueID() {
  return Math.random().toString(36).substring(2, 9);
}

//add to panel

function addToPanel() {
  let task = document.querySelector("#task").value;
  let text = document.querySelector("#text").value;
  if (task.trim() !== "" && text.trim() !== "") {
    let newText = {
      task: task,
      text: text,
      id: uniqueID(),
      timestamp: currentTime(),
    };
    todoList.push(newText);
    document.querySelector("#task").value = "";
    document.querySelector("#text").value = "";
    renderAllLists();
    saveToLocaleStorage();
  }
}

function renderAllLists() {
  renderList(todoList, "#mainPanel");
  renderList(highPriorityList, "#highPriorityPanel");
  renderList(doneList, "#donePanel");
}

function renderList(list, targetID) {
  let todoUl = document.querySelector(targetID);
  todoUl.innerHTML = "";
  list.forEach((todo) => {
    //create checkbox
    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.dataset.id = todo.id;
    //create li
    let li = document.createElement("li");
    let textNode = document.createTextNode(
      `${todo.task}: ${todo.text}\n ${todo.timestamp}`
    );
    let deleteButton = document.createElement("button");
    let doneButton = document.createElement("button");
    let doneMainButton = document.createElement("button");
    if (list === todoList) {
      deleteButton.innerHTML = "delete";
      deleteButton.addEventListener("click", () => {
        remove(todo.id);
      });
      doneMainButton.innerHTML = "Done";
      doneMainButton.addEventListener("click", () => {
        transferFromMain(todo.id);
      });
      li.prepend(checkbox);
      li.appendChild(textNode);
      li.appendChild(deleteButton);
      li.appendChild(doneMainButton);
      todoUl.appendChild(li);
    } else if (list === highPriorityList) {
      doneButton.innerHTML = "Done";
      doneButton.addEventListener("click", () => {
        transfer(todo.id);
      });
      li.appendChild(textNode);
      li.appendChild(doneButton);
      todoUl.appendChild(li);
    } else if (list === doneList) {
      li.appendChild(textNode);
      todoUl.appendChild(li);
    }
  });
}

document.querySelector("#deleteAll").addEventListener("click", () => {
  todoList = [];
  highPriorityList = [];
  doneList = [];
  renderAllLists();
  saveToLocaleStorage();
});

function remove(idToDelete) {
  todoList = todoList.filter((todo) => todo.id !== idToDelete);
  renderAllLists();
  saveToLocaleStorage();
}

document.querySelector("#highPriorityButton").addEventListener("click", () => {
  let checkedCheckboxes = document.querySelectorAll(
    '#mainPanel input[type="checkbox"]:checked'
  );
  checkedCheckboxes.forEach((checkbox) => {
    let todoIndex = todoList.findIndex(
      (item) => item.id === checkbox.dataset.id
    );
    if (todoIndex !== -1) {
      let todoItem = todoList.splice(todoIndex, 1)[0]; //remove from todoList
      highPriorityList.push(todoItem);
    }
    renderAllLists();
    saveToLocaleStorage();
  });
});

document.querySelector("#doneButton").addEventListener("click", () => {
  let checkedCheckboxes = document.querySelectorAll(
    '#mainPanel input[type="checkbox"]:checked'
  );
  checkedCheckboxes.forEach((checkbox) => {
    let todoIndex = todoList.findIndex(
      (item) => item.id === checkbox.dataset.id
    );
    if (todoIndex !== -1) {
      let todoItem = todoList.splice(todoIndex, 1)[0]; //remove from list
      doneList.push(todoItem);
    }
    renderAllLists();
    saveToLocaleStorage();
  });
});

function transferFromMain(id) {
  let todoItem = todoList.find((item) => item.id === id);
  if (todoItem) {
    let todoIndex = todoList.findIndex((item) => item.id === id);
    if (todoIndex !== -1) {
      todoList.splice(todoIndex, 1);
      doneList.push(todoItem);
      renderAllLists();
      saveToLocaleStorage();
    }
  }
}

function transfer(id) {
  let todoItem = highPriorityList.find((item) => item.id === id);
  if (todoItem) {
    let todoIndex = highPriorityList.findIndex((item) => item.id === id);
    if (todoIndex !== -1) {
      highPriorityList.splice(todoIndex, 1);
      doneList.push(todoItem);
      renderAllLists();
      saveToLocaleStorage();
    }
  }
}

function saveToLocaleStorage() {
  localStorage.setItem("todoList", JSON.stringify(todoList));
  localStorage.setItem("highPriorityList", JSON.stringify(highPriorityList));
  localStorage.setItem("doneList", JSON.stringify(doneList));
}

function loadFromLocaleStorage() {
  let storedTodoList = localStorage.getItem("todoList");
  let storedHighPriorityList = localStorage.getItem("highPriorityList");
  let storedDoneList = localStorage.getItem("doneList");

  if (storedTodoList) {
    todoList = JSON.parse(storedTodoList);
  }

  if (storedHighPriorityList) {
    highPriorityList = JSON.parse(storedHighPriorityList);
  }

  if (storedDoneList) {
    doneList = JSON.parse(storedDoneList);
  }
}

renderAllLists();
saveToLocaleStorage();

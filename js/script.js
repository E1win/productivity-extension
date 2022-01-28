"use strict";

const quotes = [
  "“Focus on being productive instead of busy.”",
  "“Do the hard jobs first. The easy jobs will take care of themselves.”",
  "“It’s not always that we need to do more but rather that we need to focus on less.”",
  "“If you spend too much time thinking about a thing, you’ll never get it done.”",
  "“Until we can manage time, we can manage nothing else.”",
  "“The way to get started is to quit talking and begin doing.”",
  "“No matter how great the talent or efforts, some things just take time. You can’t produce a baby in one month by getting nine women pregnant.”",
  "“Lost time is never found again.”",
  "“Action is the foundational key to all success.”",
  "“Amateurs sit and wait for inspiration, the rest of us just get up and go to work.”",
  "“We have a strategic plan. It’s called doing things.”",
  "“You see, in life, lots of people know what to do, but few people actually do what they know. Knowing is not enough! You must take action.”",
  "“If there are nine rabbits on the ground, if you want to catch one, just focus on one.”",
  "“Ordinary people think merely of spending time, great people think of using it.”",
];

const header = document.querySelector("h1");

const usageContainer = document.querySelector(".container-usage");
const usageContainerItems = document.querySelector(".container-usage-items");
const usageHeader = document.querySelector(".header-usage");

const todoContainer = document.getElementById("container_task");
const taskRemove = document.querySelectorAll(".task-remove");
const todoForm = document.querySelector(".todo-form");

const redditUsage = document.getElementById("reddit-usage");
const youtubeUsage = document.getElementById("youtube-usage");

let todoItems = [];
let usageObj = {};
let usageArr = ["https://reddit.com/", "https://youtube.com/"];

////////////////////////////////////////////////
// HEADER MOTIVATIONAL QUOTE
////////////////////////////////////////////////

let randomIndex = Math.floor(Math.random() * quotes.length);
header.textContent = quotes[randomIndex];

////////////////////////////////////////////////
// WEBSITE TRACKER
////////////////////////////////////////////////

const drawUsage = function () {
  localStorage.setItem("usageArrRef", JSON.stringify(usageArr));
  localStorage.setItem("usageObjRef", JSON.stringify(usageObj));

  usageContainerItems.innerHTML = "";

  for (let i = 0; i < usageArr.length; i++) {
    if (usageObj[usageArr[i]]) {
      let currentObj = usageObj[usageArr[i]];
      usageContainerItems.insertAdjacentHTML(
        "beforeend",
        `
                <div class="usage">
                    <button class="btn usage-remove" id="${currentObj.url}">x</button>
                    <p>${currentObj.name}</p>
                    <p>${currentObj.visits}</p>
                </div>
            `
      );
    } else {
      console.log(`Adding ${usageArr[i]}`);

      addNewUsage(usageArr[i]);
      return drawUsage();
    }
  }

  const usageRemoveElements = document.querySelectorAll(".usage-remove");
  usageRemoveElements.forEach((elem, i) => {
    elem.addEventListener("click", function () {
      usageArr.splice(i, 1);
      delete usageObj[elem.id];
      drawUsage();
    });
  });

  usageContainerItems.insertAdjacentHTML(
    "beforeend",
    `
        <div class="container-add-usage">
            <h4>Add new website to track:</h4>
            <div class="container-add-usage-form">
                <form class='add-usage-form'>
                    <input type="text" placeholder="Ex: 'http://google.com/'" class='add-usage-input'>
                </form>
                <button class="btn add-usage">+</button>
            </div>
        </div>
    `
  );

  const btnAddUsageTracker = document.querySelector(".add-usage");
  const usageForm = document.querySelector(".add-usage-form");
  btnAddUsageTracker.addEventListener("click", addNewURL);
  usageForm.addEventListener("submit", (event) => {
    // Needed preventDefault() to avoid a page refresh on submit
    event.preventDefault();
    addNewURL();
  });
};

///////////////////////////////////////
// Creates the usage element preview

const usagePreview = function () {
  const usagePanels = document.querySelectorAll(".usage");
  const addTracker = document.querySelector(".container-add-usage");

  usageContainerItems.classList.toggle("active");
  Array.prototype.slice.call(usagePanels, 1).forEach((panel) => {
    panel.classList.toggle("hidden");
  });
  addTracker.classList.toggle("hidden");
};
usageHeader.addEventListener("click", usagePreview);

///////////////////////////////////////
// Logic to create new usage object

const addNewURL = function () {
  const usageInput = document.querySelector(".add-usage-input");
  const text = usageInput.value.trim();

  // check if it's a valid url
  if (!isValidHttpUrl(text)) {
    // Show an invalid input message here
    console.log("Invalid URL");
    usageInput.value = "";
    return;
  }
  // Add new url to UsageObj here
  if (!usageObj[text]) addNewUsage(text);
  if (!usageArr.includes(text)) usageArr.push(text);

  drawUsage();
};

function isValidHttpUrl(string) {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
}

const addNewUsage = function (text) {
  let urlName = text.split(".")[0].split("//")[1];
  urlName = urlName[0].toUpperCase() + urlName.slice(1);

  usageObj[text] = {
    visits: 0,
    blocked: false,
    name: urlName,
    url: text,
  };
};

////////////////////////////////////////////////
// TODO LIST
////////////////////////////////////////////////

// clear the test task
todoContainer.innerHTML = "";

// Create a new todo object based on the text
// that was entered in the text input, and push
// it into the 'todoItems' array
function addTodo(inputText) {
  const todo = {
    text: inputText,
    done: false,
  };

  todoItems.push(todo);
}

// Select the form element

todoForm.addEventListener("submit", (event) => {
  // prevent page refresh on form submission
  event.preventDefault();

  // select the text input
  const input = document.querySelector(".todo-input");

  // Get the value of the input and remove whitespace
  const text = input.value.trim();
  if (text !== "") {
    addTodo(text);
    input.value = "";
    input.focus();
  }

  createTasks();
});

////////////////////////////////////////////////
// TASK CONTAINER LOGIC

const createTasks = function () {
  localStorage.setItem("todoItemsRef", JSON.stringify(todoItems));

  drawTasks();

  const tasks = document.querySelectorAll(".task");

  // Add functionality to the tasks
  tasks.forEach((task, i) => {
    // When the delete key is pressed, remove the task
    task.lastElementChild.addEventListener("click", () => {
      todoItems.splice(i, 1);
      createTasks();
    });
    // When the task is pressed anywhere else, mark the task as complete by striking the text
    task.firstElementChild.addEventListener("click", () => {
      //todoItems.splice(i, 1);
      todoItems[i].done = !todoItems[i].done;
      createTasks();
    });
  });
};

const drawTasks = function () {
  todoContainer.innerHTML = "";

  todoItems.forEach((item) => {
    todoContainer.insertAdjacentHTML(
      "beforeend",
      `<div class="task">
            <p class='task-text'>${
              item.done ? item.text.strike() : item.text
            }</p>
            <button class="btn task-remove"><p>x</p></button>
        </div>`
    );
  });
};

////////////////////////////////////////////////
// PERSIST APPLICATION STATE TO BROWSER STORAGE
////////////////////////////////////////////////

document.addEventListener("DOMContentLoaded", () => {
  const ref = localStorage.getItem("todoItemsRef");
  if (ref) {
    todoItems = JSON.parse(ref);
    createTasks();
  }

  // Get the usage object stored in browser storage from background.js

  const usageRef = localStorage.getItem("usageObjRef");
  const usageArrRef = localStorage.getItem("usageArrRef");
  if (usageRef) usageObj = JSON.parse(usageRef);
  if (usageArrRef) usageArr = JSON.parse(usageArrRef);

  drawUsage();

  if (!usageContainerItems.classList.contains("active")) {
    usagePreview();
  }
});

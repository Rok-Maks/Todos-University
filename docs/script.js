const list = document.getElementById('todo-list')
const itemCountSpan = document.getElementById('item-count')
const uncheckedCountSpan = document.getElementById('unchecked-count')
let info_el = document.querySelector(".info-el")

let datastore = {}
let todos = []
let isLoading = false

datastore.todos = todos

list.innerHTML = ""

function newTodo() {
  let task = prompt("Enter the task:")
  if (task === "" || task === null) return
  addTodo(task, false)
    .then(id => {
      let new_task = {"id": id, "task": task, "checked": false}
      // todos.push(new_task)
      render()
    })
}

async function addTodo(task, checked){
  const postToAdd = {
    task: task,
    checked: checked,
  };

  const options = {
    method: "POST",
    body: JSON.stringify(postToAdd),
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
  };

  return await fetchDB("https://todo-7b96b-default-rtdb.firebaseio.com/todo", options)
}

async function getTodos(){
  console.log("gettingTodos")
  result = await fetchDB("https://todo-7b96b-default-rtdb.firebaseio.com/todo")
  return result
}


async function render(){
  document.querySelector("*:has(body)").style.cursor = "wait"
  todos = await getTodos() || []
  console.log(todos)
  list.innerHTML = ""
  Object.keys(todos).forEach(key => renderTodo(key, todos[key]))
  updateCounters()
  document.querySelector("*:has(body)").style.cursor = "auto"
}

function renderTodo(id, todo){
  list.insertAdjacentHTML('beforeend', `
    <li class="list-group-item">
      <input type="checkbox" class="form-check-input me-2" id="${todo.id}" ${todo.checked ? "checked" : ""} onClick="check('${id}')"/>
      <label for="${id}"><span class="${todo.checked ? 'text-success text-decoration-line-through' : ''}">${todo.task}</span></label>
      <button class="btn btn-danger btn-sm float-end" onClick="deleteTodo('${id}')">delete</button>
    </li>
  `)
}

function updateCounters(){
  // console.log(todos.length)
  document.querySelector("#item-count").textContent = Object.keys(todos).length
  document.querySelector("#unchecked-count").textContent = Object.values(todos).reduce((accum, todo) => {if (!todo.checked) return accum + 1; else return accum}, 0)
}

async function deleteTodo(id){
  await fetchDB(`https://todo-7b96b-default-rtdb.firebaseio.com/todo/${id}`, {method: "DELETE"})

  // todos = Object.fromEntries(Object.entries(todos).filter( ([key, value]) => {console.log(key, id); return key !== id}))
  render()
}

async function check(id){
  const postToUpdate = {
    "id": id,
    "checked": !todos[id].checked,
  };

  const options = {
    method: "PATCH",
    body: JSON.stringify(postToUpdate),
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
  };

  await fetchDB(`https://todo-7b96b-default-rtdb.firebaseio.com/todo/${id}`, options)
  
  // todos = todos.map(todo => {if (todo.id !== id) return todo; else todo.checked = !todo.checked; return todo})
  // todo.checked = !todo.checked
  render()
}

async function fetchDB(url, options = {}) {
  document.querySelector("*:has(body)").style.cursor = "wait";
  isLoading = true
  info_el.style.visibility = "visible"
  try {
    const response = await fetch(`${url}.json`, options);
    
    if (!response.ok) {
      console.log(`Помилка сервера: ${response.status}`);
      isLoading = false
      info_el.textContent = `Помилка сервера: ${response.status}`
      info_el.style.color = "red"
    }
    const data = await response.json();
    info_el.style.visibility = "hidden"
    return data;
  } catch (err) {
    console.log(`Помилка запиту: ${err}`);
    isLoading = false
    info_el.textContent = `Помилка запиту: ${err.message}`
    info_el.style.color = "red"
  } finally {
    document.querySelector("*:has(body)").style.cursor = "default";
    isLoading = false
  }
}


async function loading() {
  let i = 0
  let str = "Loading"
  while (true){
    await new Promise(resolve => setTimeout(resolve, 500));
    if (isLoading !== false){
      if (i === 3){
        i = 0
        str = "Loading"
        continue
      }
      str += '.'
      info_el.style.color = "black"
      info_el.textContent = str
      i++
    }
  }
}

loading()
render()
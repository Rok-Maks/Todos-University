const list = document.getElementById('todo-list')
const itemCountSpan = document.getElementById('item-count')
const uncheckedCountSpan = document.getElementById('unchecked-count')

let datastore = {}
let todos = []

datastore.todos = todos

function newTodo() {
  let new_id = Date.now()
  let task = prompt("Enter the task:")
  if (task === "" || task === null) return
  let new_task = {id: Date.now(), "task": task, "checked": false}
  todos.push(new_task)
  //console.log(todos)
  render()
}


function render(){
  list.innerHTML = ""
  todos.forEach(todo => renderTodo(todo))
  updateCounters()
}

function renderTodo(todo){
  list.insertAdjacentHTML('beforeend', `
    <li class="list-group-item">
      <input type="checkbox" class="form-check-input me-2" id="${todo.id}" ${todo.checked ? "checked" : ""} onClick="check(${todo.id})"/>
      <label for="${todo.id}"><span class="${todo.checked ? 'text-success text-decoration-line-through' : ''}">${todo.task}</span></label>
      <button class="btn btn-danger btn-sm float-end" onClick="deleteTodo(${todo.id})">delete</button>
    </li>
  `)
}

function updateCounters(){
  document.querySelector("#item-count").textContent = todos.length
  document.querySelector("#unchecked-count").textContent = todos.reduce((accum, todo) => {if (!todo.checked) return accum + 1; else return accum}, 0)
}

function deleteTodo(id){
  // todos.find(todo => {return todo.id === id}).pop()
  todos = todos.filter(todo => {return todo.id !== id})
  render()
}

function check(id){
  todos = todos.map(todo => {if (todo.id !== id) return todo; else todo.checked = !todo.checked; return todo})
  // todo.checked = !todo.checked
  render()
}


render()
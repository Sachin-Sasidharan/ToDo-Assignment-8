//collecting the DOM element

//Task input field
const inputTask = document.getElementById('inputTask')
document.getElementById('inputButton').addEventListener("click", () => {
  addTask()
})

//Task List
const taskList = document.getElementById('taskList')

//Filter Bottons
const filterButtons = document.querySelectorAll('[data-filter]')

let currentFilter = 'all'

// Get tasks from localStorage and parse JSON string to array
let tasks = JSON.parse(localStorage.getItem('tasks')) || []


//Function to add task
const addTask = () => {
  if (!inputTask.value.trim()) {
    alert('Enter Your Task')
    return
  }

  // Add new task object to tasks array
  tasks.push({ text: inputTask.value.trim(), completed: false })

  saveTask()
  renderTasks()

  //To clear the input field
  inputTask.value = ''
}

//To save task in localstorage
const saveTask = () => {
  localStorage.setItem('tasks', JSON.stringify(tasks))
}

//Function to renderTask

const renderTasks = () => {
  taskList.innerHTML = ""

  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i]

    if (
      (currentFilter === 'active' && task.completed) ||
      (currentFilter === 'completed' && !task.completed)
    ) continue

   // Create a li element for the task
    const li = document.createElement('li')
    taskList.appendChild(li)

    // Create a span for task text
    const span = document.createElement('span')
    span.textContent = task.text

    // To add strike if the task is completed
    if (task.completed) {
      span.style.textDecoration = "line-through"
      span.style.color = "gray"
    }
    li.appendChild(span)
    
    //checkbox input element

    const checkbox = document.createElement('input')
    checkbox.type = 'checkbox'

    // Set checkbox state based on task completion
    checkbox.checked = task.completed

    // Append the checkbox to the list item
    li.appendChild(checkbox)

    //to update and render when checkbox is checked

    checkbox.addEventListener('change', () => {
      task.completed = checkbox.checked
      saveTask()
      renderTasks()
    })

    //For Edit button

    const editButton = document.createElement('button')
    editButton.textContent = '✏️'
    li.appendChild(editButton)
    editButton.addEventListener('click', () => editTask(i))

    //For delete button

    const deleteButton = document.createElement('button')
    deleteButton.textContent = '🗑️'
    li.appendChild(deleteButton)
    deleteButton.addEventListener('click', () => deleteTask(i))
  }

  updateCounters()
}

//Function to delete task

const deleteTask = (i) => {
// Create a new array
  let newTasks = []
  for (let j = 0; j < tasks.length; j++) {

    // Add only the tasks that do not match the index to be deleted
    if (j !== i) {
      newTasks[newTasks.length] = tasks[j]
    }
  }

  //update the orginal task list
  tasks = newTasks

  //save and render the tasklist
  saveTask()
  renderTasks()
}

//Function to edit task

const editTask = (i) => {

  //prompt is used to edit the text
  const newText = prompt("Edit your task:", tasks[i].text)
  if (newText !== null && newText.trim() !== "") {
    
    // Update the task text in the array
    tasks[i].text = newText.trim()
    
    //save and render the tasklist
    saveTask()
    renderTasks()
  }
}

//Filter Button (referred from external source)

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    currentFilter = button.getAttribute('data-filter')
    renderTasks()
    filterButtons.forEach(btn => btn.classList.remove('active'))
    button.classList.add('active')
  })
})


//Function to update counter (referred from external source)

const updateCounters = () => {
  const completed = tasks.filter(task => task.completed).length
  const uncompleted = tasks.length - completed
  document.getElementById('completed-counter').textContent = completed
  document.getElementById('uncompleted-counter').textContent = uncompleted
}

//Initial
renderTasks()

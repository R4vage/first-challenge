/* Primer acceso a los tasks guardados en local storage */
let tasks
const taskList = document.getElementById('js-task-list__table__body')

function createNewRow(task) {
    let newTr = document.createElement('tr')
    newTr.className= 'task-list__row'

    for (const prop in task){
        let td = document.createElement('td')
        td.innerText = task[prop]
        newTr.appendChild(td)
    }
    taskList.appendChild(newTr)
}



if(localStorage.getItem('tasks')){
    tasks = JSON.parse(localStorage.getItem('tasks'))
    tasks.forEach(task => {
        createNewRow(task);
    });
} else {
    tasks = []
}


const taskModal = document.getElementById('js-task-modal')


/* Sección para abrir y cerrar el modal */
const openModalButton = document.getElementById('js-open-task-modal'); /* Botón de agregar tarea */

const closeModalButton = document.getElementById('js-close-task-modal'); /* Cross para cerrar modal */

openModalButton.onclick = function (){taskModal.style.display = 'flex'}

closeModalButton.onclick = function (){taskModal.style.display = 'none'}

window.onclick = function(event) { /* Al clickear afuera del modal, se cierra */
    if (event.target === taskModal) {
        taskModal.style.display = "none";
    }
}

/* Seccion para agregar gastos */

const taskForm = document.getElementById('js-add-task__form')

taskForm.addEventListener('submit', (event) => {
    event.preventDefault()

    let name = taskForm.elements['name'].value
    let asignee = taskForm.elements['asignee'].value
    let status = taskForm.elements['status'].value
    let date = new Date().toLocaleString()
    let id = 1
    
    if (tasks.length !== 0){
        id = tasks[tasks.length-1].id +1
    }
    let task = {id:id, name:name,asignee:asignee, status:status, time: date}
    tasks.push(task)
    localStorage.setItem('tasks', JSON.stringify(tasks))
    createNewRow(task) /* Lo agregamos también a la lista, para no tener que recargar la página */
})


console.log(tasks)
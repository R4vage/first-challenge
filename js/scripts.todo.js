/* Primer acceso a los tasks guardados en local storage */
let tasks
const taskList = document.getElementById('js-task-list__table__body')
const taskModal = document.getElementById('js-task-modal')
const taskForm = document.getElementById('js-add-task__form')

function closeModal(){taskModal.style.display = 'none'}
function openModal(){taskModal.style.display = 'flex'}

function createNewRow(task) {
    
    /* Este es el padre de la fila */

    let newTr = document.createElement('tr') 
    newTr.className= `task-list__row`
    newTr.id= `js-task-row-${task.id}`

    /* Acá se agregan los datos */
    
    for (const prop in task){ 
        let td = document.createElement('td')
        td.innerText = task[prop]
        newTr.appendChild(td)
    }

    /* Agregamos el boton de eliminar */

    let newImg = document.createElement('img') 
    newImg.className=`task-item-${task.id}--delete`
    newImg.src='assets/delete.png'
    newImg.onclick = function (){
        filteredTasks = tasks.filter(element => element.id !== task.id)
        localStorage.setItem('tasks', JSON.stringify(filteredTasks))
        newTr.remove()
    }


    newTr.appendChild(newImg)

    /* Agregamos el boton de editar */

    newImg = document.createElement('img')
    newImg.className=`task-item-${task.id}--edit`
    newImg.src='assets/edit.png'
    newImg.onclick = function (){
        openModal()
        listTask = document.getElementById(`js-task-row-${task.id}`).childNodes
        taskForm.elements['id'].value = task.id
        taskForm.elements['name'].value = listTask[1].innerText
        taskForm.elements['asignee'].value = listTask[2].innerText
        taskForm.elements['status'].value = listTask[3].innerText
        taskForm.elements['submit'].value = "Modify Task"

    }

    newTr.appendChild(newImg)

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


/* Sección para abrir y cerrar el modal */
const openModalButton = document.getElementById('js-open-task-modal'); /* Botón de agregar tarea */

const closeModalButton = document.getElementById('js-close-task-modal'); /* Cross para cerrar modal */

openModalButton.onclick = function (){
    taskForm.elements['submit'].value = "Add Task"
    openModal()
    if (tasks.length === 0) {
        taskForm.elements['id'].value = 1
    } else {
        taskForm.elements['id'].value = parseInt(tasks[tasks.length-1].id) +1 
    }
    taskForm.elements['name'].value = ''
    taskForm.elements['asignee'].value = 'Not Asigned'
    taskForm.elements['status'].value = 'Pending'

}

window.onclick = function(event) { /* Al clickear afuera del modal, se cierra */
    if (event.target === taskModal) {
        closeModal()
    }
}

closeModalButton.onclick = function (){closeModal()}



/* Seccion para agregar gastos */



taskForm.addEventListener('submit', (event) => {
    event.preventDefault()

    let date
    let task
    let name = taskForm.elements['name'].value
    let asignee = taskForm.elements['asignee'].value
    let status = taskForm.elements['status'].value
    let id = taskForm.elements['id'].value

    taskIndex = tasks.findIndex(task => task.id === id)
    if (taskIndex !== -1){
        date = tasks[taskIndex].time
        task = {id:id, name:name,asignee:asignee, status:status, time: date}
        tasks[taskIndex] =  task
        listTask = document.getElementById(`js-task-row-${task.id}`).childNodes
        listTask[1].innerText = name
        listTask[2].innerText = asignee
        listTask[3].innerText = status
    } else {
        date = new Date().toLocaleString()
        task = {id:id, name:name,asignee:asignee, status:status, time: date}
        tasks.push(task)
        createNewRow(task) /* Lo agregamos también a la lista, para no tener que recargar la página */
    }
    
    localStorage.setItem('tasks', JSON.stringify(tasks))    
    closeModal()
})


console.log(tasks)
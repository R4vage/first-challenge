/* Primer acceso a los tasks guardados en local storage */
let tasks  /* En esta variable se storea la lista completa de tareas */
let currentlyShownTasks /* Esta variable es para storear los tasks que el usuario está viendo */
const taskList = document.getElementById('js-task-list__table__body')
const taskModal = document.getElementById('js-task-modal')
const taskForm = document.getElementById('js-add-task__form')

console.log(taskForm.elements['status'].value)

/* Función para mostrar */



/* Funciones para abrir y cerrar el modal para agregar/modificar gastos */

function closeModal(){taskModal.style.display = 'none'}
function openModal(){taskModal.style.display = 'flex'}


/* Funcion para agregar una fila a la lista de tareas */

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
    /* Agregamos un contenedor para los iconos */
    
    let newDiv = document.createElement('div') 
    newDiv.className= `task-list__row__icons`
    
    /* Agregamos el boton de eliminar */

    let newImg = document.createElement('img') 
    newImg.className=`task-item-${task.id}--delete`
    newImg.src='assets/delete.png'

    newImg.onclick = function (){
        removedTaskIndex = tasks.findIndex(element => element.id === task.id)
        tasks.splice(removedTaskIndex, 1)
        sortBy('id', true)
        localStorage.setItem('tasks', JSON.stringify(tasks))
        newTr.remove()
    }

    newDiv.appendChild(newImg)

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

    newDiv.appendChild(newImg)
    newTr.appendChild(newDiv)
    taskList.appendChild(newTr)
}



if(localStorage.getItem('tasks')){
    tasks = JSON.parse(localStorage.getItem('tasks'))
    tasks.forEach(task => {
        createNewRow(task);
    });
    currentlyShownTasks = tasks
} else {
    tasks = []
}


/* Sección para botones de abrir y cerrar el modal */

const openModalButton = document.getElementById('js-open-task-modal'); /* Botón de agregar tarea */

const closeModalButton = document.getElementById('js-close-task-modal'); /* Cross para cerrar modal */

openModalButton.onclick = function (){
    taskForm.elements['submit'].value = "Add Task"
    if (tasks.length === 0) {
        taskForm.elements['id'].value = 1
    } else {
        taskForm.elements['id'].value = parseInt(tasks[tasks.length-1].id) +1 
    }
    taskForm.elements['name'].value = ''
    taskForm.elements['asignee'].value = 'Not Asigned'
    taskForm.elements['status'].value = 'Pending'
    openModal()

}

window.onclick = function(event) { /* Al clickear afuera del modal, se cierra */
    if (event.target === taskModal) {
        closeModal()
    }
}

closeModalButton.onclick = function (){closeModal()}



/* Seccion para agregar tasks */



taskForm.addEventListener('submit', (event) => {
    event.preventDefault()

    let date
    let task
    let name = taskForm.elements['name'].value
    let asignee = taskForm.elements['asignee'].value
    let status = taskForm.elements['status'].value
    let id = taskForm.elements['id'].value

    taskIndex = tasks.findIndex(task => task.id === id)

    /* Este submit es para el caso en que se este modificando una tarea que ya existe */
    if (taskIndex !== -1){
        date = tasks[taskIndex].time
        task = {id:id, name:name,asignee:asignee, status:status, time: date}
        tasks[taskIndex] =  task
        listTask = document.getElementById(`js-task-row-${task.id}`).childNodes
        listTask[1].innerText = name
        listTask[2].innerText = asignee
        listTask[3].innerText = status
    } else {
    /* Este submit es cuando el usuario desea agregar una tarea nueva */
        date = new Date().toLocaleString([], {year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'})
        task = {id:id, name:name,asignee:asignee, status:status, time: date}
        tasks.push(task)
        createNewRow(task) /* Lo agregamos también a la lista, para no tener que recargar la página */
    }
    sortBy('id', true)
    localStorage.setItem('tasks', JSON.stringify(tasks))    
    closeModal()
    currentlyShownTasks = tasks
})

/* SECCIÓN DE FILTROS */

const searchInput = document.getElementById('js-task-list__search__input')
const searchButton = document.getElementById('js-task-list__search__button')
const statusSelect = document.getElementById('js-task-list__filters__status__select')


/* Sección para busqueda de tasks */

function searchTasks (){
    let searchValue = searchInput.value
    let selectValue = statusSelect.value
    if( selectValue === 'All') {
        currentlyShownTasks = tasks.filter(element => element.name.includes(searchValue))
    } else {
        currentlyShownTasks = tasks.filter(element => element.status === selectValue && element.name.includes(searchValue))
    }
    
    taskList.innerHTML=''
    currentlyShownTasks.forEach(task => {
        createNewRow(task);
    });
}

searchButton.onclick = function (){ searchTasks()}

/* Por si el usuario presiona enter estando en el input */

searchInput.addEventListener ( "keydown", function (e){
    if (e.code === "Enter") {
        searchTasks()
    }
})

/* Filtro de tasks por estado */

statusSelect.onchange = function (){
    let selectValue = statusSelect.value
    let searchValue = searchInput.value
    if (searchInput.value === '') {
        if (selectValue === 'All') {
            currentlyShownTasks = tasks
        } else {
            currentlyShownTasks = tasks.filter(element => element.status === selectValue)
        }
    } else {
        if (selectValue === 'All') {
            currentlyShownTasks = tasks.filter(element => element.name.includes(searchValue))
        } else {
            currentlyShownTasks = tasks.filter(element => element.status === selectValue && element.name.includes(searchValue))
        }
    }
    taskList.innerHTML = ''
    currentlyShownTasks.forEach(task => {
        createNewRow(task);
    });
}

/* Funcionalidad de SortBy */

const sortByNameAscButton = document.getElementById('js-sortBy-name-asc')
const sortByNameDescButton = document.getElementById('js-sortBy-name-desc')
const sortByTimeAscButton = document.getElementById('js-sortBy-time-asc')
const sortByTimeDescButton = document.getElementById('js-sortBy-time-desc')
const sortByIdAscButton = document.getElementById('js-sortBy-id-asc')
const sortByIdDescButton = document.getElementById('js-sortBy-id-desc')

function sortBy (sorter, isAsc){

    currentlyShownTasks.sort((a,b) => {
        let varA
        let varB
        if (sorter === 'name'){    
            varA = a.name.toLowerCase();
            varB = b.name.toLowerCase();
        } else if (sorter === 'time') {
            varA = new Date(a.time).getTime()
            varB = new Date(b.time).getTime()
        } else if (sorter ==='id'){
            varA = parseInt(a.id)
            varB = parseInt(b.id)
        }
        if (isAsc){
            if (varA < varB) {
            return -1;
            }
            if (varA > varB){
            return 1
            }
        } else {
            if (varA < varB) {
                return 1;
            }
            if (varA > varB){
                return -1
            }
        }
        return 0
    })

    taskList.innerHTML = ''
    currentlyShownTasks.forEach(task => {
        createNewRow(task);
    });
}

sortByNameAscButton.onclick= function(){
    sortBy('name', true)
}

sortByNameDescButton.onclick = function(){
    sortBy('name', false)
}

sortByTimeAscButton.onclick= function(){
    sortBy('time', true)
}

sortByTimeDescButton.onclick = function(){
    sortBy('time', false)
}

sortByIdAscButton.onclick= function(){
    sortBy('id', true)
}

sortByIdDescButton.onclick = function(){
    sortBy('id', false)
}

console.log(tasks)
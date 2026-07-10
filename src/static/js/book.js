import { el } from "./utils/createElements.js"

const openGroup = document.getElementById('openGroup')
const closeGroup = document.getElementById('closeGroup')
const group = document.querySelector('.notesGroup')
const inputGroup = group.querySelector('input')
const buttonGroup = group.querySelector('button')
const ulGroup = group.querySelector('ul')

const notesNameGroup = document.querySelector('.title h2')
const notesContainer = document.querySelector('.notes-container')

const inputAddNote = document.querySelector('.notes .form input')
const btnAddNote = document.querySelector('.notes .form button')

let dataNotes
let dataNoteGroup

// LISTENERS ===============================================

notesContainer.addEventListener('click',async(e)=>{
  if(e.target.tagName != 'I') return
  const idNote = e.target.closest('.note').dataset.id

  const result = await deleteNote(idNote)

  if(!result) {
    console.log('hubo error al borrar')
    return
  }else{
    const index = dataNotes.findIndex(nota => nota.id == idNote);

    if (index !== -1) {
      dataNotes.splice(index, 1);
    }
    
    let { id } = notesContainer.dataset
    if (typeof id == 'undefined') id = null
    paintNotes(id)
  }

})

inputAddNote.addEventListener('keydown', (e) => {
  if (e.key == 'Enter' && inputAddNote.value) {
    btnAddNote.click()
  }
})

btnAddNote.addEventListener('click', async (e)=>{
  if(!inputAddNote.value) return

  let {id} = notesContainer.dataset

  if(typeof id == 'undefined') id = null

  const data = await postNote(inputAddNote.value, id)

  if(!data) {
    console.log('hubo un problema')
    return
  }else{
    dataNotes.push(data)
    let {id} = notesContainer.dataset
    if(typeof id == 'undefined') id = null
    paintNotes(id)
  }

  inputAddNote.value = ''
  inputAddNote.focus()
})

inputGroup.addEventListener('keydown',(e)=>{
  if (e.key == 'Enter' && inputGroup.value){
    buttonGroup.click()
  }
})

buttonGroup.addEventListener('click', async ()=>{

  if(!inputGroup.value) return

  const data = await postNoteGroup(inputGroup.value)

  if(typeof data == 'undefined') return

  const li = el('li', undefined, inputGroup.value)
  ulGroup.appendChild(li)
  
  inputGroup.value = ''
  inputGroup.focus()
})

ulGroup.addEventListener('click',(e)=>{

  if (e.target.tagName != 'LI') return
  
  const element = e.target
  const id = element.getAttribute('data-id')

  ulGroup.querySelectorAll('li').forEach(item => {
    item.classList.remove('selected')
  })

  element.classList.add('selected')
  group.classList.remove('show')
  paintNotes(id)
})

openGroup.addEventListener('click',()=>{
  group.classList.add('show')
})

closeGroup.addEventListener('click',()=>{
  group.classList.remove('show')
})

// RENDER FUNCTIONS ========================================

function paintNoteGroup(){
  ulGroup.innerHTML = '<li class="selected">Notas Sueltas</li>'

  dataNoteGroup.forEach(element => {
    const li = el('li',undefined,element.name)
    li.setAttribute('data-id',element.id)
    ulGroup.appendChild(li) 
  });
}

function paintNotes(group = null){
  inputAddNote.value = ''
  // esto mas bien no deberia depender de nadie, lo que deberiamos seterar solo es el data.id de ".notes-container"

  if(group){

    const {name} = dataNoteGroup.filter(e=>e.id == group)[0]

    notesContainer.setAttribute('data-id',group)
    notesNameGroup.textContent = name
  }else{
    notesContainer.removeAttribute('data-id')
    notesNameGroup.textContent = 'Notas Sueltas'
  }

  const dataFilter = dataNotes.filter(e=> e.group_id == group)

  if(dataFilter.length == 0){
    notesContainer.innerHTML = '<p>No hay notas aún</p>'
    return
  }

  const fragment = document.createDocumentFragment()
  
  dataFilter.forEach(e =>{

    const div = el('div','note')
    const p = el('p',undefined,e.content)
    const i = el('i','bi bi-x')

    div.setAttribute('data-id',e.id)

    div.appendChild(p)
    div.appendChild(i)

    fragment.appendChild(div)
  })

  notesContainer.replaceChildren(fragment)
  
  // reemplazar contenido

}

// idk functions ===========================================

// asignar al estado la info 
// si no se puede hacer entonces mostrar un popup
async function init(){

  const noteGroupData = await getNoteGroup()
  const notes = await getNotes()

  if (typeof noteGroupData == 'undefined' || typeof notes == 'undefined') return

  // NOTEGROUP

  dataNoteGroup = noteGroupData
  dataNotes = notes

  console.log('======================')
  console.log('dataNoteGroup')
  console.log(dataNoteGroup)
  console.log('dataNotes')
  console.log(dataNotes)
  console.log('======================')

  paintNotes()
  paintNoteGroup()
}

// FETCH FUNCTIONS =========================================

async function getNotes(){
  const result = await fetch('/api/notes')

  if(!result.ok){
    console.log('Algo salio mal al pedir los datos')
    return
  }

  const data = await result.json()
  return data
}

async function postNote(content, group_id = null) {

  const result = await fetch('/api/note', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({
      content: content,
      group_id: group_id
    })
  })

  if (!result.ok) {
    return
  } else {
    const data = await result.json()
    return data
  }

}

async function deleteNote(id){
  const result = await fetch(`/api/note/${id}`, {
    method: 'DELETE'
  })

  if (!result.ok) {
    return
  } else {
    return true
  }
}

async function getNoteGroup(){
  const result = await fetch('/api/notegroup')

  if(!result.ok){
    console.log('Algo salio mal al pedir los datos')
    return
  }

  const data = await result.json()
  return data
}

async function postNoteGroup(name) {

  const result = await fetch('/api/notegroup', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({
      name: name
    })
  })

  if (!result.ok) {
    console.log('Algo salio mal al pedir los datos')
    return
  }

  return true
}

// APP INIT ================================================

init()
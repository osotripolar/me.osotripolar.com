import { el } from "./utils/createElements.js"
import { inputModalBi } from "./components/modal.js"

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

notesContainer.addEventListener('click', async (e) => {
  if (e.target.tagName != 'I') return

  const idNote = e.target.closest('.note').dataset.id

  if (e.target.classList.contains('bi-pencil-fill')) {

    const idContainer = getIdNotesContainer()
    const contenidoOriginal = dataNotes.find(note => note.id == idNote)

    const response = await inputModalBi(contenidoOriginal, dataNoteGroup, {
      defaultOption: "Notas Sueltas",
      idOption: idContainer
    })

    if (!response) return
    
    const { content, group_id } = response
    
    const res = await putNote(idNote, content, group_id)
    
    if (!res) {
      console.log('toast: Hubo problemilla')
      return
    } else {
      const note = dataNotes.find(e => e.id == idNote);
      if (note) {
        note.content = content
        note.group_id = group_id
      }
      paintNotes(notesContainer.dataset.id)
    }

  }

  if (e.target.classList.contains('bi-x')) {
    const result = await deleteNote(idNote)

    if (!result) {
      // habría que poner un toast
      console.log('hubo error al borrar')
      return
    } else {
      const index = dataNotes.findIndex(nota => nota.id == idNote);

      if (index !== -1) {
        dataNotes.splice(index, 1);
      }

      let { id } = notesContainer.dataset

      paintNotes(id)
    }
  }

})

inputAddNote.addEventListener('keydown', (e) => {
  if (e.key == 'Enter' && inputAddNote.value) {
    btnAddNote.click()
  }
})

btnAddNote.addEventListener('click', async (e) => {
  if (!inputAddNote.value) return

  let { id } = notesContainer.dataset

  if (typeof id == 'undefined') id = null

  const data = await postNote(inputAddNote.value, id)

  if (!data) {
    console.log('hubo un problema')
    return
  } else {
    dataNotes.push(data)
    let { id } = notesContainer.dataset
    paintNotes(id)
  }

  inputAddNote.value = ''
  inputAddNote.focus()
})

inputGroup.addEventListener('keydown', (e) => {
  if (e.key == 'Enter' && inputGroup.value) {
    buttonGroup.click()
  }
})

buttonGroup.addEventListener('click', async () => {

  if (!inputGroup.value) return

  const data = await postNoteGroup(inputGroup.value)

  if (typeof data == 'undefined') return

  dataNoteGroup.push(data)

  const li = el('li')
  li.setAttribute('data-id', data.id)
  li.innerHTML = `
  <p>${data.name}</p>
  <i class="bi bi-x"></i>
  `
  ulGroup.appendChild(li)

  dashNoteGroup(data.id)
  paintNotes(data.id)
  group.classList.remove('show')
  inputGroup.value = ''
  inputAddNote.focus()
})

ulGroup.addEventListener('click', async (e) => {

  if (e.target.tagName == 'P' || e.target.tagName == 'LI') {
    const id = e.target.closest('li').getAttribute('data-id')
    dashNoteGroup(id)
    paintNotes(id)
    group.classList.remove('show')
  }

  if (e.target.tagName == 'I') {
    const id = e.target.closest('li').getAttribute('data-id')

    const result = await deleteNoteGroup(id)

    if (!result) {
      // habría que poner un toast
      console.log('Hubo un error inesperado')
      return
    } else {
      const index = dataNoteGroup.findIndex(nota => nota.id == id);

      if (index !== -1) {
        dataNoteGroup.splice(index, 1);
      } else {
        console.log('hubo otro tipo derror revisar codigo')
      }
      e.target.closest('li').remove()

      // modificacion del estado
      // modificacion de render:
      // - quitar del dom
      // - si estaba activo ese item entonces cambiar a la vista de notas en general
    }
  }

})

openGroup.addEventListener('click', () => {
  group.classList.add('show')
})

closeGroup.addEventListener('click', () => {
  group.classList.remove('show')
})

// RENDER FUNCTIONS ========================================

function paintNoteGroup() {
  ulGroup.innerHTML = '<li class="selected"><p>Notas Sueltas</p></li>'

  if (!(dataNoteGroup.length > 0)) return


  const fragment = document.createElement

  dataNoteGroup.forEach(element => {

    const li = el('li', undefined, element.name)
    li.innerHTML = `
    <p>${element.name}</p>
    <i class="bi bi-x"></i>
    `

    li.setAttribute('data-id', element.id)
    ulGroup.appendChild(li)
  });
}

function paintNotes(idGroup) {

  if (idGroup) {
    const { name } = dataNoteGroup.filter(e => e.id == idGroup)[0]

    notesContainer.dataset.id = idGroup
    notesNameGroup.textContent = name
  } else {
    notesNameGroup.textContent = 'Notas Sueltas'
    notesContainer.removeAttribute('data-id')
  }

  let { id } = notesContainer.dataset
  if (typeof id == 'undefined') id = null

  const dataFiltereddddd = dataNotes.filter(e => e.group_id == id)

  if (dataFiltereddddd.length != 0) {

    const fragment = document.createDocumentFragment()

    dataFiltereddddd.forEach(e => {
      const div = el('div', 'note')
      const p = el('p', undefined, e.content)
      const editIcon = el('i', 'bi bi-pencil-fill')
      const deleteIcon = el('i', 'bi bi-x')

      div.setAttribute('data-id', e.id)

      div.appendChild(p)
      div.appendChild(editIcon)
      div.appendChild(deleteIcon)

      fragment.appendChild(div)
    })

    notesContainer.replaceChildren(fragment)

  } else {
    notesContainer.innerHTML = '<p>No hay notas aún</p>'
  }

  inputAddNote.value = ''
}

// idk functions ===========================================

function getIdNotesContainer() {
  const id = notesContainer.dataset.id

  if (!id) {
    return null
  }
  return id
}

function dashNoteGroup(id) {
  // limpiamos todoslos campos
  ulGroup.querySelectorAll('li').forEach(item => {
    item.removeAttribute('class')
  })

  if (id) {
    const li = ulGroup.querySelector(`li[data-id="${id}"]`)
    li.classList.add('selected')
  } else {
    ulGroup.querySelector('li').classList.add('selected')
  }

}

async function init() {
  ulGroup.querySelectorAll('li').forEach(item => {
    item.classList.remove('selected')
  })

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

async function getNotes() { /// NOTAS↓↓↓
  const result = await fetch('/api/notes')

  if (!result.ok) {
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

async function deleteNote(id) {
  const result = await fetch(`/api/note/${id}`, {
    method: 'DELETE'
  })

  if (!result.ok) {
    return
  } else {
    return true
  }
}

async function putNote(id, content, group_id) {

  
  if (!id && !content) {
    console.log('no pasaste los parametros oe mongol')
    return
  }
  
  const result = await fetch(`/api/note/${id}`, {
    method: 'PUT',
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
    return true
  }

}

async function getNoteGroup() { /// NOTAS GROUP↓↓↓
  const result = await fetch('/api/notegroup')

  if (!result.ok) {
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

  const data = await result.json()
  return data
}

async function deleteNoteGroup(id) {
  const result = await fetch(`/api/notegroup/${id}`, {
    method: 'DELETE'
  })

  if (!result.ok) {
    return
  } else {
    return true
  }
}

// APP INIT ================================================

init()
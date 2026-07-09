import {el} from "./utils/createElements.js"

const contentMain = document.querySelector('main .content')

const form = document.querySelector('.form')
const input = form.querySelector('input')
const buttonAdd = form.querySelector('#btnAdd')

// LISTENERS

buttonAdd.addEventListener('click', ()=>{
  if (!input.value) return

  postNote(input.value)
  input.value = ''
  input.focus()
})

input.addEventListener('keydown',(e)=>{
  if (!input.value) return

  if(e.key === 'Enter'){
    buttonAdd.click()
  }
})

contentMain.addEventListener('click', async (e)=>{
  if (e.target.tagName == 'I'){

    const note = e.target.closest('.note')

    // buscar al padre, preguntarle su id
    const {id} = note.dataset

    // hacer una peticion fetch con el id

    // const result = await fetch('/')

    await deleteNote(id)
    
    note.remove()

  }  

})

// RENDER FUNCTIONS

async function paintData(){
  const data = await showData()

  if(data.length == 0){
    console.log('no hay datos')
  }else{
    contentMain.innerHTML = ''

    data.forEach(element => {
      const note = el('div','note')
      note.setAttribute("data-id",element.id)
      const content = el('p',undefined, element.content)
      const i = el('i','bi bi-trash2')

      note.appendChild(content)
      note.appendChild(i)

      contentMain.appendChild(note)
    });

  }


}

// FETCH FUNCTIONS
async function showData() {
  const result = await fetch('/api/notes')

  if (!result.ok) {
    return console.log('no tenemos acceso')
  }

  const data = await result.json()

  return data
}

async function postNote(content) {

  const group_id = null

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
    console.log('Hubo un error en la operación')
  }else{
    paintData()
  }

}

async function deleteNote(id) {
  const result = await fetch(`/api/note/${id}`,{
    method: 'DELETE'
  })

  if(!result.ok){
    console.log('algo falló')
  }else{
    console.log(result.status)
  }
}


// APP INIT

function init(){
  paintData()
}

init()
import { el } from "../utils/createElements.js";

// AÑADIENDO AL DOM ================================
const modalContainer = el('div', 'modal-container hidden')
document.body.appendChild(modalContainer)

// FUNCIONES A EXPORTAR ============================

// ME GUSTARÍA PODER HACER DE INPUTmODAL UNIFICARLO Y QUE SEA MAS FLEXIBLE 
// TENIENDO UN PARAMETRO DE ENTRADA UN OBJETO donde ponemos las configuraciones

export function inputModal(text = undefined) {
  modalContainer.classList.remove('hidden')

  const ele = el('div', 'modal')

  ele.innerHTML = `
  <div>
    <label for="">Edit:</label>
    <input type="text">
  </div>
  <div>
    <button>Enviar</button>
    <button>Cancelar</button>
  </div>
  `

  modalContainer.replaceChildren(ele)

  return new Promise((resolve, reject) => {

    const input = ele.querySelector('input')

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        enviarInfo()
        modalContainer.replaceChildren()
        modalContainer.classList.add('hidden')
        return
      }

      if (e.key === 'Escape') {
        resolve(null)
        modalContainer.replaceChildren()
        modalContainer.classList.add('hidden')
        return
      }
    })

    input.focus()

    if (text !== undefined) {
      input.value = text
    }

    ele.addEventListener('click', (e) => {
      if (e.target.tagName != 'BUTTON') return

      if (e.target.textContent == 'Enviar') enviarInfo()

      if (e.target.textContent == 'Cancelar') resolve(null)

      modalContainer.replaceChildren()
      modalContainer.classList.add('hidden')
    })

    function enviarInfo() {
      // VALIDAMOS ANTES DE EJECUTAR
      if ((text === undefined) && (input.value == '')) {
        resolve(null)
      }

      if (input.value == text) {
        resolve(null)
      }
      resolve(input.value) // ÚNICO CASO DONDE APLICA 
    }

  })

}

// variacion de esta funcion
// debe recibir como parametro tambien un array de opciones validas
// y esto debe retornar un objeto con datos de content y group_id
// para poder hacer el fetch

export function inputModalBi(text, array, options) {

  const { content, group_id } = text

  const modal = el('div', 'modal modal--input')

  modal.innerHTML = `
  
  <div>
    <label for="content">Edit:</label>
    <input type="text" id="content">
  </div>
  
  <div>
    <label for="group">Group: </label>
    <select name="group" id="group">
  </select>
  </div>

  <div>
    <button>Enviar</button>
    <button>Cancelar</button>
  </div>
  `
  modalContainer.replaceChildren(modal)

  const input = modal.querySelector('input')
  const select = modal.querySelector('select')

  if (array) {

    const fragment = document.createDocumentFragment()

    if (options.defaultOption) {
      const option = el('option', undefined, options.defaultOption)
      option.setAttribute('value', '')
      fragment.appendChild(option)
    }

    array.forEach(element => {
      const option = el('option', undefined, element.name)
      option.setAttribute('value', element.id)
      fragment.appendChild(option)
    });

    select.replaceChildren(fragment)

    if (options.idOption) {
      select.value = options.idOption
    }

  } else {
    console.log('error modal no hay array no hay array')
    return
  }

  modalContainer.classList.remove('hidden')

  return new Promise((resolve, reject) => {

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        enviarInfo()
        modalContainer.replaceChildren()
        modalContainer.classList.add('hidden')
        return
      }

      if (e.key === 'Escape') {
        resolve(null)
        modalContainer.replaceChildren()
        modalContainer.classList.add('hidden')
        return
      }
    })

    input.focus()

    if (content !== undefined) {
      input.value = content
    }

    modal.addEventListener('click', (e) => {

      if (e.target.tagName != 'BUTTON') return

      if (e.target.textContent == 'Enviar') enviarInfo()

      if (e.target.textContent == 'Cancelar') resolve(null)

      modalContainer.replaceChildren()
      modalContainer.classList.add('hidden')
    })

    function enviarInfo() {

      const idSelect = getSelecValue()

      if (content == input.value && group_id == idSelect) {
        console.log('no paso na, resolvimos null')
        resolve(null)
        return
      }

      resolve({
        content: input.value,
        group_id: idSelect
      })
    }

  })

  function getSelecValue() {
    const id = select.value
    if (id) {
      return id
    } else {
      return null
    }
  }

}

export function modalConfirm(options) {

  const {question, title} = options
  
  modalContainer.classList.remove('hidden')

  const ele = el('div', 'modal')

  ele.innerHTML = `
  ${title ? `<h3>${title}</h3>` : ""}
  ${question ? `<p>${question}</p>` : ""}
  <div>
  <button>Si</button>
  <button>No</button>
  </div>
  `
  modalContainer.replaceChildren(ele)

  return new Promise((resolve, reject) => {
    ele.addEventListener('click', (e) => {
      if (e.target.tagName != 'BUTTON') return

      if (e.target.textContent == 'Si') resolve(true)
      if (e.target.textContent == 'No') resolve(false)

      modalContainer.replaceChildren()
      modalContainer.classList.add('hidden')
    })
  })
}
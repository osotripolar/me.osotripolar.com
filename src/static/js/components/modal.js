import { el } from "../utils/htmElements.js";

// AÑADIENDO AL DOM ================================
const modalContainer = el('div', 'modal-container hidden')

document.body.appendChild(modalContainer)

// SUPPORT FUNCTIONS ================================

const nameIconDataClose = 'closeModal'
const nameIconDataSend = 'sendModal'

export function addCloseButton(modal, onclose){

  // CLOSE BUTTONS
  const iconClose = el('i','bi bi-x closeModal')
  iconClose.dataset.action = nameIconDataClose

  modal.appendChild(iconClose)
  modal.addEventListener('click',(e)=>{
    
    const actionModal = e.target.dataset.action
    if(actionModal == nameIconDataClose){
      if(onclose) onclose()
      closeModalContainer()
    }
  })
}

function focusAndSelectToEnd(input) {
  input.focus();
  // Selecciona desde el inicio hasta el final,
  // dejando el cursor (focus) al final.
  input.setSelectionRange(0, input.value.length, "forward");
}

// MODAL FUNCTIONS ================================

export function closeModalContainer() {
  modalContainer.replaceChildren()
  modalContainer.classList.add('hidden')
}

export function modalConfirm(options) {

  const { question, title } = options

  modalContainer.classList.remove('hidden')

  const modal = el('div', 'modal')

  modal.innerHTML = `
  ${title ? `<h3>${title}</h3>` : ""}
  ${question ? `<p>${question}</p>` : ""}
  <div>
  <button data-action="${nameIconDataSend}">Si</button>
  <button data-action="${nameIconDataClose}">No</button>
  </div>
  `

  modalContainer.replaceChildren(modal)

  return new Promise((resolve, reject) => {
    addCloseButton(modal,()=>{
      resolve(null)
      return
    })

    modal.addEventListener('click', (e) => {
      if (e.target.tagName != 'BUTTON') return
      if (e.target.dataset.action == nameIconDataSend) resolve(true)
      closeModalContainer()
    })
  })
}

export function inputModal(options) {

  // listado de opciones para este modal
  const { text = null, title = null, label = null } = options

  const modal = el('div', 'modal')

  modal.innerHTML = `
  ${title ? `<h3>${title}</h3>` : ""}
  <div class="block-input">
    <label for="">${label ? `${label}:` : "Edit: "}</label>
    <input type="text" ${text ? `value="${text}"` : ""}>
  </div>
  <div>
    <button>Enviar</button>
    <button data-action="${nameIconDataClose}">Cancelar</button>
  </div>
  `

  const input = modal.querySelector('input')

  modalContainer.replaceChildren(modal)
  modalContainer.classList.remove('hidden')

  return new Promise((resolve, reject) => {

    addCloseButton(modal, () => {
      resolve(null)
      return
    })

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        enviarInfo()
        closeModalContainer()
        return
      }

      if (e.key === 'Escape') {
        resolve(null)
        closeModalContainer()
        return
      }
    })

    focusAndSelectToEnd(input)

    modal.addEventListener('click', (e) => {
      if (e.target.tagName != 'BUTTON') return

      if (e.target.textContent == 'Enviar') enviarInfo()

      if (e.target.textContent == 'Cancelar') resolve(null)

      closeModalContainer()
    })

    function enviarInfo() {
      // VALIDAMOS ANTES DE EJECUTAR

      if (input.value == '') {
        resolve(null)
      }

      if (Boolean(text) && text == input.value) {
        resolve(null)
      }

      resolve(input.value) // ÚNICO CASO DONDE APLICA 
    }

  })

}

export function inputSelectModal(options) {

  const {
    arrayOptions = null,
    originalContent = { content: null, group_id: null },
    defaultOption = 'default option',
    title = null,
    labelInput = 'texto',
    labelSelect = 'lista',
    idOptionActive = null
  } = options

  const { content, group_id } = originalContent

  const modal = el('div', 'modal ')

  modal.innerHTML = `
  ${title ? `<h3>${title}</h3>` : ""}
  <div class="block-input">
    <label for="content">${labelInput} : </label>
    <input type="text" id="content">
    <label for="group">${labelSelect} : </label>
    <select name="group" id="group">
    </select>
  </div>

  <div>
    <button>Enviar</button>
    <button data-action="${nameIconDataClose}">Cancelar</button>
  </div>
  `

  const input = modal.querySelector('input')
  const select = modal.querySelector('select')
  const fragment = document.createDocumentFragment()


  if (defaultOption) {
    const option = el('option', undefined, defaultOption)
    option.setAttribute('value', '')
    fragment.appendChild(option)
  }

  if (arrayOptions) {
    arrayOptions.forEach(element => {
      const option = el('option', undefined, element.name)
      option.setAttribute('value', element.id)
      fragment.appendChild(option)
    });

    select.replaceChildren(fragment)

    if (idOptionActive) {
      select.value = idOptionActive
    }
  }

  modalContainer.replaceChildren(modal)
  modalContainer.classList.remove('hidden')

  return new Promise((resolve, reject) => {

    addCloseButton(modal, () => {
      resolve(null)
      return
    })

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        enviarInfo()
        closeModalContainer()
        return
      }

      if (e.key === 'Escape') {
        resolve(null)
        closeModalContainer()
        return
      }
    })

    if (content !== undefined) {
      input.value = content
    }

    focusAndSelectToEnd(input)

    modal.addEventListener('click', (e) => {

      if (e.target.tagName != 'BUTTON') return

      if (e.target.textContent == 'Enviar') enviarInfo()

      closeModalContainer()
    })

    function enviarInfo() {

      const idSelect = getSelecValue()

      if (content == input.value && group_id == idSelect) {
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

export function modalPersonal(modal) {
  modalContainer.classList.remove('hidden')
  modalContainer.replaceChildren(modal)

  addCloseButton(modal)
}
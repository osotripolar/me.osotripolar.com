import { el } from "./utils/htmElements.js"
import { modalPersonal, closeModalContainer } from "./components/modal.js"

const btnAddCashSession = document.getElementById('btnAddCashSession')
const movInfoContainer = document.querySelector('.movements-info')
const movContainer = document.querySelector('.movements-container')
const btnAddMovement = document.getElementById('btnOpenModalMovement')

const fgModal = document.getElementById('fgModalAddBlock')
const fgModalMov = document.getElementById('fgModalAddMovement')

let dataWallets
let dataCashSessions
let dataCashSessionsSources
let dataCategories
let dataMovements

// LISETENERS ===========================================================
document.body.addEventListener('keydown', (e) => {
  if (e.key == '|') {
    printState()
  }
})

btnAddCashSession.addEventListener('click', addNewCashSession)

btnAddMovement.addEventListener('click', addMovement)

// FETCH FUNCTIONS ======================================================
async function getCashSessions() { /// cash_sessions ↓↓↓
  const result = await fetch('/api/cash_sessions')

  if (!result.ok) {
    console.log('Algo salio mal al pedir los datos')
    return
  }

  const data = await result.json()
  return data
}

async function postCashSessions(description = null) {

  const result = await fetch('/api/cash_sessions', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({
      description: description
    })
  })

  if (!result.ok) {
    return
  } else {
    const data = await result.json()
    return data
  }

}

async function getCategories() { /// categories ↓↓↓
  const result = await fetch('/api/categories')

  if (!result.ok) {
    console.log('Algo salio mal al pedir los datos')
    return
  }

  const data = await result.json()
  return data
}

async function getMovements() { /// movements ↓↓↓
  const result = await fetch('/api/movements')

  if (!result.ok) {
    console.log('Algo salio mal al pedir los datos: movements')
    return
  }

  const data = await result.json()
  return data
}

async function postMovements(object) {

  const result = await fetch('/api/movements', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify(object)
  })

  if (!result.ok) {
    return
  } else {
    const data = await result.json()
    return data
  }
}

async function getMoneySources() { /// money_sources ↓↓↓
  const result = await fetch('/api/money_sources')

  if (!result.ok) {
    console.log('Algo salio mal al pedir los datos')
    return
  }

  const data = await result.json()
  return data
}

async function postMoneySource(name) {

  const result = await fetch('/api/money_sources', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({
      name: name
    })
  })

  if (!result.ok) {
    return
  } else {
    const data = await result.json()
    return data
  }

}

async function getCashSessionsSources() { /// cash_sessions_sources ↓↓↓
  const result = await fetch('/api/cash_sessions_sources')

  if (!result.ok) {
    console.log('Algo salio mal al pedir los datos')
    return
  }

  const data = await result.json()
  return data
}

async function postCashSessionsSources(objetc) {

  const { cash_session_id, mony_source_id, starting_balance } = objetc

  const result = await fetch('/api/cash_sessions_sources', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({
      cash_session_id: cash_session_id,
      mony_source_id: mony_source_id,
      starting_balance: starting_balance
    })
  })

  if (!result.ok) {
    return
  } else {
    const data = await result.json()
    return data
  }

}

// RENDER FUNCTIONS ======================================================
function findIdMayor(array) {
  if (array.length == 0) return null
  let max = array[0]
  array.forEach(e => {
    if (max.id < e.id) max = e
  })
  return max
}

function renderAll() {

  const p = movInfoContainer.querySelector('.message')
  const description = movInfoContainer.querySelector('.movements-info__description')
  const movContent = movInfoContainer.querySelector('.movements-info__content')
  const movWallets = movInfoContainer.querySelector('.movements-info__wallets')
  const blockStart = movInfoContainer.querySelector('.block--start .money')

  // normalización
  p.classList.remove('dissapear')
  movContent.classList.add('dissapear')
  description.classList.add('dissapear')

  if (dataCashSessions.length != 0) {
    movContent.classList.remove('dissapear')
    p.classList.add('dissapear')

    // filtrado de datos

    const dataFiltred = findIdMayor(dataCashSessions)
    if (!dataFiltred) { // esto no debería pasar
      console.log('toast: hubo un problema inesperado')
      return
    }

    const dataWalletsActual = dataCashSessionsSources.filter(e => e.cash_session_id == dataFiltred.id)

    // setting info
    movInfoContainer.dataset.id = dataFiltred.id

    if (dataFiltred.description) {
      description.classList.remove('dissapear')
      description.textContent += dataFiltred.description
    }

    const fragment = document.createDocumentFragment()

    if (!dataWalletsActual || dataWalletsActual.length == 0) { // esto no debería pasar
      console.log('filtrando dataChashSessions es 0 o null')
      return
    }

    let totalMonyInit = 0

    dataWalletsActual.forEach(wallet => {

      const { mony_source_id, starting_balance } = wallet
      const walletName = dataWallets.find(e => e.id == mony_source_id).name

      const blockStart = el('div', 'block')
      blockStart.dataset.info = 'start'

      blockStart.innerHTML = `
      <div>
        <p>${walletName}</p>
        <p>S/</p>
      </div>
      <p>${starting_balance}</p>
      `

      const blockEnd = el('div', 'block')
      blockEnd.dataset.info = 'end'

      blockEnd.innerHTML = `
      <div>
        <p>${walletName}</p>
        <p>S/</p>
      </div>
      <p>${starting_balance}</p>
      `

      fragment.appendChild(blockStart)
      fragment.appendChild(blockEnd)

      totalMonyInit += Number(starting_balance)

    })

    movWallets.replaceChildren(fragment)

    blockStart.textContent = totalMonyInit

    // ul.classList.remove('hidden')
    // ul.replaceChildren(fragment)

    renderTable(dataFiltred.id)

  }
}

function renderTable(idCash) {

  if (!idCash) return

  movContainer.classList.remove('hidden')


  const movements = dataMovements.filter(e => e.cash_session_id == idCash)

  const tbody = movContainer.querySelector('tbody')
  tbody.replaceChildren()

  if (movements.length == 0) {
    console.log('Aún no hay registros para esta tabla')
    return
  }

  const fragment = document.createDocumentFragment()

  movements.forEach(e => {
    const tr = generateTr(e)

    fragment.appendChild(tr)
  })

  tbody.appendChild(fragment)


  function generateTr(data) {

    const nameFrom = dataWallets.find(e => e.id == data.from_mony_source_id)?.name ?? '-';
    const nameTo = dataWallets.find(e => e.id == data.to_mony_source_id)?.name ?? '-';
    const nameDescription = data.description ?? '-'
    const nameCategorie = dataCategories.find(e => e.id == data.category_id)?.name ?? '-';

    console.log(nameFrom, nameTo);

    const tr = el('tr')
    tr.dataset.id = data.id

    tr.innerHTML = `
    <td>S/ ${data.amount_cents}</td>
    <td>${nameDescription}</td>
    <td>${nameFrom}</td>
    <td>${nameTo}</td>
    <td>${nameCategorie}</td>
    `
    return tr
  }

  // filtramos los movimientos que tengan como cashSessionId el que esta en el parametro

}

function printState(title = 'PRINTING STATE') {
  console.log('======= ' + title + ' ============')
  console.log('cash sessions', dataCashSessions)
  console.log('money sources', dataWallets)
  console.log('cash session sources', dataCashSessionsSources)
  console.log('movements', dataMovements)
  console.log('=========================================')
}

// ANOTHER FUNCTIONS =====================================================

function addMovement() {

  // debemos tomar el id del titulo
  const idContext = movInfoContainer.dataset.id

  const modalFragment = fgModalMov.content.cloneNode(true)
  const modal = modalFragment.querySelector('.modal')

  const inputMovAmount = modal.querySelector('#inputMovAmount')
  const inputMovDescription = modal.querySelector('#inputMovDescription')
  const selectMovFrom = modal.querySelector('#inputMovFrom')
  const selectMovTo = modal.querySelector('#inputMovTo')
  const selectMovCategory = modal.querySelector('#inputMovCategory')

  const btnAddMovement = modal.querySelector('#btnAddMovement')

  // llenamos options
  const dataWalletsActual = dataCashSessionsSources.filter(e => e.cash_session_id == idContext)
  dataWalletsActual.forEach(e => {
    const wallet = dataWallets.find(ele => ele.id == e.mony_source_id)
    const option = el('option', undefined, wallet.name)

    option.value = wallet.id
    const clone = option.cloneNode(true)

    selectMovFrom.appendChild(option)
    selectMovTo.appendChild(clone)
  })

  // categoria va sin filtrar

  modalPersonal(modal)

  btnAddMovement.addEventListener('click', async () => {

    const objectPost = {
      cash_session_id: idContext,
      amount: inputMovAmount.value,
      from_mony_source_id: selectMovFrom.value,
      to_mony_source_id: selectMovTo.value,
      category_id: selectMovCategory.value,
      description: inputMovDescription.value,
    }

    Object.entries(objectPost).forEach(([key, value]) => {
      if (value === "") {
        objectPost[key] = null;
      }
    });

    if (objectPost.amount == null) {
      console.log('amount no puede ser vacio')
      return
    }

    const result = await postMovements(objectPost)

    if (!result) {
      console.log('error al hacer post a movements')
      return
    }

    dataMovements.push(result)
    closeModalContainer()
    renderTable(idContext)

    // recargamos las cosas
  })

}

async function addNewCashSession() {

  const modalFragment = fgModal.content.cloneNode(true)

  const modal = modalFragment.querySelector('.modal')
  const btnAddBlock = modal.querySelector('#btnAddBlock')
  const btnAddWallet = modal.querySelector('#btnAddWallet')
  const inputBlock = modal.querySelector('#inputBlock')
  const inputWallet = modal.querySelector('#inputWallet')
  const walletContainer = modal.querySelector('.wallet-container')

  paintWallet()

  inputWallet.addEventListener('keydown', (e) => {
    if (e.key == 'Enter') {
      btnAddWallet.click()
    }
  })

  inputBlock.addEventListener('keydown', (e) => {
    if (e.key == 'Enter') {
      btnAddBlock.click()
    }
  })

  btnAddBlock.addEventListener('click', async () => {
    const description = inputBlock.value ? inputBlock.value : null
    const chekboxes = walletContainer.querySelectorAll('input[type="checkbox"]')

    if (chekboxes.length == 0) {
      console.log('Toast: debes tener al menos una wallet')
      return
    }

    let isChekedSome = false

    chekboxes.forEach(e => {
      if (e.checked) {
        isChekedSome = true
      }
    })

    if (!isChekedSome) {
      console.log('Toast: debes seleccionar por lo menos uno')
      return
    }

    // antes de esto deberíamos revisar que este marcado los cheks (almenos uno)
    const result = await postCashSessions(description)

    if (!result) {
      console.log('no paso niverga')
      return
    } else {
      dataCashSessions.push(result)
    }

    chekboxes.forEach(async (e) => {
      if (e.checked) {

        const wallet = e.closest('.wallet')
        const id = wallet.dataset.id
        const mount_balance = wallet.querySelector('input[type="text"]').value

        const startingBalance = Boolean(mount_balance) ? mount_balance : 0

        const resultado = await postCashSessionsSources({
          cash_session_id: result.id,
          mony_source_id: id,
          starting_balance: startingBalance,
          description: description
        })

        if (!resultado) {
          console.log('toogle: algo falló')
        } else {
          dataCashSessionsSources.push(resultado)
        }

        closeModalContainer()
        renderAll()
      }
    })
  })

  btnAddWallet.addEventListener('click', async () => {
    if (!inputWallet.value) return

    // hacemos una peticion post
    const res = await postMoneySource(inputWallet.value)

    if (!res) {
      console.log('Huno un error al postear la wallet')
      return
    } else {
      dataWallets.push(res)
      paintWallet()
    }

    inputWallet.value = ''
  })

  modalPersonal(modal)

  // const data = await getCashSessions()
  // console.log('abrir un modal')
  // console.log('preparar el cash_sessions_sources')
  // console.log('en este cuadro obtener los mony_sources y hacer un crud tambien, pero en este caso vamos a asignar los que esten habilitados y los que no')

  function paintWallet() {

    if (dataWallets.length == 0) {
      walletContainer.textContent = 'Aún no tienes wallets'
    } else {

      const fragment = document.createDocumentFragment()

      dataWallets.forEach(e => {
        const wallet = el('div', 'wallet',)
        wallet.dataset.id = e.id

        wallet.innerHTML = `
        <input type="checkbox">
        <p>S/</p>
        <input type="text">
        <p>${e.name}</p>
        <div class="wallet__buttons">
          <i class="bi bi-x"></i>
          <i class="bi bi-pencil-fill"></i>
        </div>
        `

        const inputCheckbox = wallet.querySelector('input[type="checkbox"]')
        const inputText = wallet.querySelector('input[type="text"]')

        inputCheckbox.checked = Boolean(e.active)

        fragment.appendChild(wallet)
      })

      walletContainer.replaceChildren(fragment)
    }

  }
}

async function init() {

  try {
    dataCashSessions = await getCashSessions()
    dataCategories = await getCategories()
    dataWallets = await getMoneySources()
    dataCashSessionsSources = await getCashSessionsSources()
    dataMovements = await getMovements()

    printState('DATOS INICIADA LA APP')

    renderAll()

  } catch (error) {
    console.log(error)
    console.log('Hubo un error al arrancar la aplicación')
  }
}

init()

// en la configuración ajustaremos los tipos de wallets
// creamos un registro en una tabla auxiliar, que son los wallets activos para este cashCollection

// al iniciar la aplicacion deberíamos traer los datos de:
//    --cash_sessions()
//    --mony_sources()
//    --cash_sessions_sources()
//    --movements()

// buscaremos el ultimo id de cash sessions, si no existe pondremos un botón que diga crear uno
// cargamos el estado: mony sources, cash session sources, movements
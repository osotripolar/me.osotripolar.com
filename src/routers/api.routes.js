import { json, Router } from "express";
import { isAuthApi } from "../middleware/auth.middleware.js";
import { INTERNAL_BEARER_TOKEN, BACKEND_URL } from "../config.js";

const router = Router()

// NOTES ================================================

router.get('/notes', isAuthApi, async (req, res) => { // notes ↓↓↓

  const result = await fetch(`${BACKEND_URL}/personal/notes`, {
    headers: {
      Authorization: `${INTERNAL_BEARER_TOKEN}`
    }
  });

  if (!result.ok) {
    return res.sendStatus(500)
  }

  const data = await result.json()

  res.json(data)

})

router.post('/note', isAuthApi, async (req, res) => {

  try {

    const { content, group_id } = req.body

    if (!content) {
      return res.sendStatus(400)
    }

    const result = await fetch(`${BACKEND_URL}/personal/note`, {
      method: 'POST',
      headers: {
        Authorization: INTERNAL_BEARER_TOKEN,
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        content: content,
        group_id: group_id
      })

    });

    if (!result.ok) {
      return res.sendStatus(400)
    }

    const data = await result.json()
    return res.status(201).json(data)

  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }

})

router.delete('/note/:id', isAuthApi, async (req, res) => {
  try {
    const { id } = req.params

    if (!id) {
      return res.sendStatus(400)
    }

    // fetch a api
    const result = await fetch(`${BACKEND_URL}/personal/note/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: INTERNAL_BEARER_TOKEN,
      }
    })

    if (!result.ok) {
      return res.sendStatus(402)
    }

    return res.sendStatus(203)


  } catch (error) {
    return res.sendStatus(500)
  }
})

router.put('/note/:id', isAuthApi, async (req, res) => {

  try {

    const { id } = req.params
    const { content, group_id } = req.body

    if (!content || !id) {
      return res.sendStatus(400)
    }

    const result = await fetch(`${BACKEND_URL}/personal/note/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: INTERNAL_BEARER_TOKEN,
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        content: content,
        group_id: group_id
      })

    });

    if (!result.ok) {
      return res.sendStatus(400)
    } else {
      return res.sendStatus(200)
    }
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }

})

// NOTEGROUP

router.get('/notegroup', isAuthApi, async (req, res) => { // notegroup ↓↓↓

  const result = await fetch(`${BACKEND_URL}/personal/notegroup`, {
    headers: {
      Authorization: `${INTERNAL_BEARER_TOKEN}`
    }
  })

  if (!result.ok) {
    return res.sendStatus(403)
  }

  const data = await result.json()
  return res.json(data)

})

router.post('/notegroup', isAuthApi, async (req, res) => {

  try {

    const { name } = req.body


    if (!name) {
      return res.sendStatus(400)
    }

    const result = await fetch(`${BACKEND_URL}/personal/notegroup`, {
      method: 'POST',
      headers: {
        Authorization: INTERNAL_BEARER_TOKEN,
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        name: name
      })

    });

    if (!result.ok) {
      console.log(result.status)
      return res.sendStatus(400)
    }

    const data = await result.json()
    return res.status(201).json(data)

  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }

})

router.delete('/notegroup/:id', isAuthApi, async (req, res) => {

  try {
    const { id } = req.params

    if (!id) {
      return res.sendStatus(400)
    }

    // fetch a api
    const result = await fetch(`${BACKEND_URL}/personal/notegroup/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: INTERNAL_BEARER_TOKEN,
      }
    })

    if (!result.ok) {
      return res.sendStatus(402)
    }

    return res.sendStatus(203)

  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
})

router.put('/notegroup/:id', isAuthApi, async (req, res) => {

  try {

    const { id } = req.params
    const { name } = req.body

    if (!name || !id) {
      return res.sendStatus(400)
    }

    const result = await fetch(`${BACKEND_URL}/personal/notegroup/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: INTERNAL_BEARER_TOKEN,
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        name: name
      })

    });

    if (!result.ok) {
      return res.sendStatus(400)
    } else {
      return res.sendStatus(200)
    }
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }

})

// EXPENSES =============================================

router.get('/cash_sessions', isAuthApi, async (req, res) => { // cash_sessions ↓↓↓

  const result = await fetch(`${BACKEND_URL}/personal/cash_sessions`, {
    headers: {
      Authorization: `${INTERNAL_BEARER_TOKEN}`
    }
  });

  if (!result.ok) {
    return res.sendStatus(500)
  }

  const data = await result.json()

  res.json(data)

})

router.post('/cash_sessions', isAuthApi, async (req, res) => {

  try {
    
    const { description = null} = req.body
    
    const result = await fetch(`${BACKEND_URL}/personal/cash_sessions`, {
      method: 'POST',
      headers: {
        Authorization: INTERNAL_BEARER_TOKEN,
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        description: description
      })
    });

    if (!result.ok) {
      console.log(result.status)
      return res.sendStatus(400)
    }

    const data = await result.json()

    return res.status(201).json(data)

  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }

})

router.get('/categories', isAuthApi, async (req, res) => { // categories ↓↓↓

  const result = await fetch(`${BACKEND_URL}/personal/categories`, {
    headers: {
      Authorization: `${INTERNAL_BEARER_TOKEN}`
    }
  });

  if (!result.ok) {
    return res.sendStatus(500)
  }

  const data = await result.json()

  res.json(data)

})

router.get('/movements', isAuthApi, async (req, res) => { // movements ↓↓↓

  const result = await fetch(`${BACKEND_URL}/personal/movements`, {
    headers: {
      Authorization: `${INTERNAL_BEARER_TOKEN}`
    }
  });

  if (!result.ok) {
    return res.sendStatus(500)
  }

  const data = await result.json()

  res.json(data)

})

router.post('/movements', isAuthApi, async (req, res) => {

  try {

    const result = await fetch(`${BACKEND_URL}/personal/movements`, {
      method: 'POST',
      headers: {
        Authorization: INTERNAL_BEARER_TOKEN,
        'Content-type': 'application/json'
      },
      body: JSON.stringify(req.body)
    });

    if(!result.ok){
      console.log('hubo un fallo en movementsPOST')
      return res.sendStatus(400)
    }

    const data = await result.json()

    return res.json(data)

    
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }

})

router.get('/money_sources', isAuthApi, async (req, res) => { // money_sources ↓↓↓

  const result = await fetch(`${BACKEND_URL}/personal/money_sources`, {
    headers: {
      Authorization: `${INTERNAL_BEARER_TOKEN}`
    }
  });

  if (!result.ok) {
    return res.sendStatus(500)
  }

  const data = await result.json()

  res.json(data)

})

router.post('/money_sources', isAuthApi, async (req, res) => {

  try {

    const { name } = req.body

    if (!name) {
      return res.sendStatus(400)
    }

    const result = await fetch(`${BACKEND_URL}/personal/money_sources`, {
      method: 'POST',
      headers: {
        Authorization: INTERNAL_BEARER_TOKEN,
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        name: name
      })
    });

    if (!result.ok) {
      console.log(result.status)
      return res.sendStatus(400)
    }

    const data = await result.json()
    return res.status(201).json(data)

  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }

})

router.get('/cash_sessions_sources', isAuthApi, async (req, res) => { // cash_sessions__souces ↓↓↓

  const result = await fetch(`${BACKEND_URL}/personal/cash_sessions_sources`, {
    headers: {
      Authorization: `${INTERNAL_BEARER_TOKEN}`
    }
  });

  if (!result.ok) {
    return res.sendStatus(500)
  }

  const data = await result.json()

  res.json(data)

})

router.post('/cash_sessions_sources', isAuthApi, async (req, res) => {

  try {

    const { cash_session_id, mony_source_id, starting_balance } = req.body

    if (!cash_session_id || !mony_source_id || starting_balance == null) {
      return res.sendStatus(400)
    }

    const result = await fetch(`${BACKEND_URL}/personal/cash_sessions_sources`, {
      method: 'POST',
      headers: {
        Authorization: INTERNAL_BEARER_TOKEN,
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        cash_session_id,
        mony_source_id,
        starting_balance,
      })
    });

    if (!result.ok) {
      console.log(result.status)
      return res.sendStatus(400)
    }

    const data = await result.json()
    return res.status(201).json(data)

  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }

})

export default router
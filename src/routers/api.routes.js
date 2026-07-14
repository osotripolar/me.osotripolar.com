import { json, Router } from "express";
import { isAuthApi } from "../middleware/auth.middleware.js";
import { INTERNAL_BEARER_TOKEN, BACKEND_URL } from "../config.js";

const router = Router()

// NOTES

router.get('/notes', isAuthApi, async (req, res) => {

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
    
    const {id} = req.params
    const { content, group_id } = req.body

    if (!content || !id) {
      console.log(content,group_id,id)
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
    }else{
      return res.sendStatus(200)
    }
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }

})

// NOTEGROUP

router.get('/notegroup', isAuthApi ,async (req,res)=>{

  const result = await fetch(`${BACKEND_URL}/personal/notegroup`, {
    headers: {
      Authorization: `${INTERNAL_BEARER_TOKEN}`
    }
  })

  if(!result.ok){
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

    console.log(result)

    if (!result.ok) {
      return res.sendStatus(402)
    }

    return res.sendStatus(203)

  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
})

export default router
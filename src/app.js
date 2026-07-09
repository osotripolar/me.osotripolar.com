import path from "node:path"
import express from "express"
import cookieParser from "cookie-parser"
import jwt from "jsonwebtoken"

import { ROOT, PORT, JWT_SECRET, BACKEND_URL, INTERNAL_BEARER_TOKEN } from "./config.js"

import pagesRouter from "./routers/pages.routes.js"
import apiRouter from "./routers/api.routes.js"

const app = express()

// MIDDLWHERES ===================================================
app.use(cookieParser())
app.use(express.json())
app.set('view engine', 'ejs')
app.set('views', path.join(ROOT, 'views'))

// MIDDLEHWERES II =============================================

function auth(req, res, next) {
  try {
    const { token } = req.cookies
    req.user = jwt.verify(token, JWT_SECRET)
    next()
  } catch (error) {
    return res.status(403).render('403', { admin: req.user.admin })
  }
} 

// SITES =========================================================
app.use(express.static(path.join(ROOT, 'static')))

// con esto vemos credenciales
app.use((req, res, next) => {
  try {

    const { token } = req.cookies
    req.user = jwt.verify(token, JWT_SECRET)
    next()

  } catch (error) {

    if (error.message == 'jwt must be provided') {
      // console.log('no tiene token') 
    }

    if (error.message == 'jwt expired') {
      res
        .clearCookie('token')
    }

    req.user = { admin: false }
    next()
  }
})

app.use(pagesRouter)
app.use('/api',apiRouter)

// APP INIT: =====================================================

app.listen(PORT, () => {
  console.log('Server on port: ', PORT)
})
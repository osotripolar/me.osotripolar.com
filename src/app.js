import path from "node:path"
import express from "express"
import cookieParser from "cookie-parser"
import jwt from "jsonwebtoken"

import { ROOT, PORT, JWT_SECRET, BACKEND_URL, INTERNAL_BEARER_TOKEN } from "./config.js"

import pagesRouter from "./routers/pages.routes.js"
import apiRouter from "./routers/api.routes.js"
import { readCredentials } from "./middleware/auth.middleware.js"

const app = express()

// MIDDLWHERES ===================================================
app.use(cookieParser())
app.use(express.json())
app.set('view engine', 'ejs')
app.set('views', path.join(ROOT, 'views'))

// SITES =========================================================
app.use(express.static(path.join(ROOT, 'static')))

app.use(readCredentials)

app.use(pagesRouter)
app.use('/api',apiRouter)

// APP INIT: =====================================================

app.listen(PORT, () => {
  console.log('Server on port: ', PORT)
})
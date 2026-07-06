import path from "node:path"
import express from "express"
import cookieParser from "cookie-parser"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

import { ROOT, PORT, HASH_USER_PASSWORD, SALT_ROUND, JWT_SECRET } from "./config.js"

const app = express()

// MIDDLWHERES ===================================================
app.use(cookieParser())
app.use(express.json())
app.set('view engine', 'ejs')
app.set('views', path.join(ROOT, 'views'))

// MIDDLEHWERES II =============================================

function auth (req,res,next){
  try {
    const { token } = req.cookies
    req.user = jwt.verify(token, JWT_SECRET)
    next()
  } catch (error) {
    return res.render('403', { admin: req.user.admin })
  }
}

// SITES =========================================================
app.use(express.static(path.join(ROOT, 'static')))

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

app.get('/', (req, res) => {
  res.render('index', { admin: req.user.admin })
})

app.get('/login', (req, res) => {
  res.render('login', { admin: req.user.admin })
})

app.get('/protected', auth, (req, res) => {
  res.render('protected', { admin: req.user.admin })
})


app.post('/login', async (req, res) => {

  const { password } = req.body
  const hashPassword = await bcrypt.hash(password, SALT_ROUND)

  // console.log('el input ingresado: ', password)
  // console.log('su hash es: ', hashPassword)

  const isValid = await bcrypt.compare(password, HASH_USER_PASSWORD)

  if (!isValid) {
    return res.sendStatus(401)
  }

  const token = jwt.sign(
    { admin: true },
    JWT_SECRET,
    { expiresIn: '1h' }
  )

  res
    .cookie('token', token, {
      httpOnly: true,
      secure: true,
      nameSite: "strict"
    })
    .sendStatus(204)
})

app.post('/logout', (req, res) => {
  res
    .clearCookie('token')
    .sendStatus(204)
})

// APP INIT: =====================================================

app.listen(PORT, () => {
  console.log('Server on port: ', PORT)
})
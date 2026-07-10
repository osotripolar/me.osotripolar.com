import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { Router } from "express";

import { isAuthPage , isAuthApi} from "../middleware/auth.middleware.js";
import { SALT_ROUND , HASH_USER_PASSWORD , JWT_SECRET} from "../config.js";

const router = Router()

// RUTAS SEGUN AUTH ============================

router.get('/', (req, res) => {
  res.render('index', { admin: req.user.admin })
})

router.get('/login', (req, res) => {
  res.render('login', { admin: req.user.admin })
})

router.post('/login', async (req, res) => {

  const { password } = req.body
  const hashPassword = await bcrypt.hash(password, SALT_ROUND)

  const isValid = await bcrypt.compare(password, HASH_USER_PASSWORD)

  if (!isValid) {
    return res.sendStatus(401)
  }

  const token = jwt.sign(
    { admin: true },
    JWT_SECRET,
    { expiresIn: '24h' }
  )

  res
    .cookie('token', token, {
      httpOnly: true,
      secure: true,
      nameSite: "strict"
    })
    .sendStatus(204)
})

router.post('/logout', (req, res) => {
  res
    .clearCookie('token')
    .sendStatus(204)
})

// RUTAS  PROTEGIDAS ============================

router.get('/book', isAuthPage, (req, res) => {
  res.render('book', { admin: req.user.admin })
})

export default router
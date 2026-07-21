import jwt from "jsonwebtoken"
import { JWT_SECRET } from "../config.js"

export const isAuthPage = (req, res, next) => {
  try {
    const {token} = req.cookies
    req.user = jwt.verify(token, JWT_SECRET)
    return next()
  } catch (error) {
    return res.status(403).render('403', { admin: req.user.admin })
  }
}

export const isAuthApi = (req,res,next) =>{
  try{
    const {token} = req.cookies
    req.user = jwt.verify(token, JWT_SECRET)
    return next()
  }catch(error){
    console.log(error)
    return res.status(403).json({message: 'No tienes autorizacion para este recurso'})
  }

}

export const readCredentials = (req, res, next) => {
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
}
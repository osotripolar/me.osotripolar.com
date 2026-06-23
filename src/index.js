import path from "node:path"
import express from "express"

import { ROOT , PORT } from "./config.js"

const app = express()

app.get('/',(req,res)=>{
  res.sendFile(path.join(ROOT,'views','index.html'))
})

app.use(express.static(path.join(ROOT,'static')))

app.listen(PORT,()=>{
  console.log('Server on port: ', PORT)
})
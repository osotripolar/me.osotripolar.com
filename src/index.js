import express from "express"

const app = express()
const PORT = 3000

app.get('/',(req,res)=>{
  res.send('kyuole papaito')
})

app.listen(PORT,()=>{
  console.log('Server on port: ', PORT)
})
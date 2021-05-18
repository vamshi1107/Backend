const express = require("express")
const emailRouter = require("./mail")
const fs =require("fs")
const cors=require('cors')
const app=express()
const port=process.env.PORT || 5000

const indexPage=fs.readFileSync("index.html").toString()

app.use("/mail",emailRouter)
app.use(cors({}))



app.get("/",(req,res)=>{
  res.send(indexPage)
})

app.listen(port,()=>{
    console.log("Listening at "+port)
})
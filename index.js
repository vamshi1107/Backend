const express = require("express")
const emailRouter = require("./mail")
const cors=require('cors')
const app=express()
const port=process.env.PORT || 5000

app.use("/mail",emailRouter)
app.use(cors({}))


app.get("/",(req,res)=>{
    res.send("This is  server of vamshi addanki ")
})

app.listen(port,(data,err)=>{
    console.log("Listening at "+port)
})
const express = require("express")

const app=express()
const port=process.env.port || 1107

app.get("/",(req,res)=>{
    res.send("This is  server of vamshi addanki ")
})

app.listen(port,(data,err)=>{
    console.log("Listening at "+port)
})
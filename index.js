const express = require("express")

const app=express()

app.get("/",(req,res)=>{
    res.send("This is  server of vamshi addanki ")
})

app.listen(1107,()=>{
    console.log("Listening at 1107")
})
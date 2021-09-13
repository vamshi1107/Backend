const express = require("express")
const emailRouter = require("./mail")
const testRouter = require("./testapi")
const formrouter = require("./form")
const fs =require("fs")
const cors=require('cors')
const mongo = require("mongodb").MongoClient
const parser=require("body-parser")
const mongoose =require("mongoose")
const app=express()
var dotenv = require('dotenv').config()

const port=process.env.PORT || 5000

const indexPage=fs.readFileSync("index.html").toString()

const uri=process.env.uri


const allowedOrigins = ['http://localhost:3000',"*"];

const options= {
  "origin": allowedOrigins
};

app.use(cors()) 
app.use(express.json())


// mongo.connect(uri,(err,db)=>{
//    if(err){
//        console.log("error")
//    }
//    else{
//       var test= db.db("myFirstDatabase").collection("test")
  
//     db.close()
//    }
// })
mongoose.connect(uri,{ useUnifiedTopology: true,useNewUrlParser: true  })


const connection=mongoose.connection

connection.on("open",()=>{
   console.log("connected")
})


app.use("/mail",emailRouter)
app.use("/test",testRouter)
app.use("/form",formrouter)

app.get("/",(req,res)=>{
  res.send(indexPage)
})

app.listen(port,()=>{
    console.log("Listening at "+port)
})
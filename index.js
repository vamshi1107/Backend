const express = require("express")
const fs =require("fs")
const cors=require('cors')
const parser=require("body-parser")
var dotenv = require('dotenv').config()

const mongo = require("mongodb").MongoClient
const mongoose =require("mongoose")

const emailRouter = require("./mail")
const testRouter = require("./testapi")
const formrouter = require("./form")
const saharaRouter=require("./sahara")

const app=express()


const port=process.env.PORT || 9000

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
app.use("/sahara",saharaRouter)

app.get("/",(req,res)=>{
  console.log(res)
  res.send(indexPage)
})

app.listen(port,()=>{
    console.log("Listening at "+port)
})
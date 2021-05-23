const express = require("express")
const emailRouter = require("./mail")
const testRouter = require("./testapi")
const fs =require("fs")
const cors=require('cors')
const mongo = require("mongodb").MongoClient
const parser=require("body-parser")
const mongoose =require("mongoose")
const app=express()
const port=process.env.PORT || 5000

const indexPage=fs.readFileSync("index.html").toString()
const uri="mongodb://vamshi:Avk1234.@cluster0-shard-00-00.ayh3k.mongodb.net:27017,cluster0-shard-00-01.ayh3k.mongodb.net:27017,cluster0-shard-00-02.ayh3k.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-ttn3b4-shard-0&authSource=admin&retryWrites=true&w=majority"
app.use(cors({origin:"*"}))

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
app.use(parser.json())

app.get("/",(req,res)=>{
  res.send(indexPage)
})

app.listen(port,()=>{
    console.log("Listening at "+port)
})
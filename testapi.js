const nodemailer=require('nodemailer')
const express=require("express")
const cors=require('cors')
const mongoose=require("mongoose")
const app=express()
app.use(cors({}))


const testRouter=express.Router()

testRouter.get("/getCars",async (req,res)=>{
     var result=[]
     var con= await mongoose.connection
     var cur=con.db.collection("test").find()
     await cur.forEach(ele=>{
         result.push(ele)
     })
     res.send(result)
})
 

module.exports=testRouter
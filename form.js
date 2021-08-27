const  express =require('express')
const mongoose =require('mongoose')

formrouter =express.Router()


formrouter.post("/add",async (req,res)=>{
         const con=await mongoose.connection
         const collection =con.db.collection("myforms_forms")
         const data=req.body
          var rc=await collection.findOne({"formid":data.formid})
          var result
          if(rc){
            result=await collection.updateOne({"formid":data.formid},{$set:{...data}})
          }
          else{
            result=await collection.insertOne(data)
          }
        console.log(result)
         res.send({"count":result.modifiedCount})

})


formrouter.post("/get",async (req,res)=>{
         const con=await mongoose.connection
         const collection =con.db.collection("myforms_forms")
         const data=req.body
          var rc=await collection.findOne({"formid":data.formid})
         
         res.send(rc)

})


module.exports=formrouter
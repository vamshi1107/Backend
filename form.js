const  express =require('express')
const mongoose =require('mongoose')
const { all } = require('./mail')

formrouter =express.Router()


formrouter.post("/add",async (req,res)=>{
         const con=await mongoose.connection
         const collection =con.db.collection("myforms_forms")
         const data=req.body
         var result
         await collection.find({"formid":data.formid}, async(err,dt)=>{
             if(err){
                  res.send({"status":0})
             } 
             else{
               var all=await dt.toArray()
               if(all.length>0){
                     var ex=data
                     Object.keys(ex).forEach(function(key){
                       if (key === "_id") {
                         delete ex[key];
                       }
                      });
                     result=await collection.updateOne({"formid":data.formid},{$set:{...ex}})
                     res.send({"status":2,"modifiedCount": 1})
                 }
                else{
                     result=await collection.insertOne(data)
                     res.send({"status":1,"insertedCount": 1})
                  }
             }
         })

})


formrouter.post("/get",async (req,res)=>{
         const con=await mongoose.connection
         const collection =con.db.collection("myforms_forms")
         const data=req.body  
         var all;
         var rc;
         await collection.find({},async (err,dt)=>{
          if(err){
             res.send({"err":true})
          } 
          else{
               all=await dt.toArray()
               all.forEach(ele=>{
                 if(ele.formid===data.formid){
                   rc=ele
                 }
               })
               res.send(rc)
          }
         })
})

formrouter.post("/remove",async (req,res)=>{
         const con=await mongoose.connection
         const collection =con.db.collection("myforms_forms")
         const data=req.body  
         var q={"formid":data.formid}
         await collection.deleteOne(q,(err,dt)=>{
            if(err){
              res.send(false)
            }
            else{
              res.send(true)
            }
         })
          
})

formrouter.post("/getall",async (req,res)=>{
         const con=await mongoose.connection
         const collection =con.db.collection("myforms_forms")
         const data=req.body  
         var all;
         var rc;
         await collection.find({},async (err,dt)=>{
          if(err){
             res.send({"err":true})
          } 
          else{
               all=await dt.toArray()
               res.send(all)
          }
         })


})

module.exports=formrouter
const e = require('express')
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
                     res.send({"status":2,"modifiedCount": result.modifiedCount})
                 }
                else{
                     result=await collection.insertOne(data)
                     res.send({"status":1,"insertedCount": result.insertedCount})
                  }
             }
         })

})


formrouter.post("/addresp",async (req,res)=>{
         const con=await mongoose.connection
         const collection =con.db.collection("myforms_response")
         const data=req.body
         var result
         result=await collection.insertOne(data)
         res.send({"status":1,"insertedCount": result.insertedCount})
})

formrouter.post("/showresp",async (req,res)=>{
         const con=await mongoose.connection
         const collection =con.db.collection("myforms_response")
         const data=req.body
        await collection.find({"formid":data.formid},async (err,dt)=>{
            if(err){
              res.send("error")
            }
            else{
                var con=await dt.toArray()
                res.send(con)
            }
         })
})

formrouter.post("/getresp",async (req,res)=>{
         const con=await mongoose.connection
         const collection =con.db.collection("myforms_response")
         const data=req.body  
         var form
         var resp;
         var q={"respid":data.respid}
         await con.db.collection("myforms_forms").findOne({"formid":data.formid },async (err,dt)=>{
                 if(!err){ 
                   form=dt
                   await collection.findOne(q,async (err2,dt2)=>{
                     if(!err){
                       resp=dt2
                       form["ruser"]=resp.ruser
                       form["feilds"].map(ele=>{
                        ele.type==1?ele.value=getValue(resp,ele.fid):
                                    ele.value=getValue(resp,ele.fid),
                                    ele.oid=getOption(resp,ele.fid)
                                  }
                        )
                       res.send(form)
                      }
                  }
                  )
                 }
          })
})

function getValue(resp,id){
     return resp["responses"].filter(ele=>ele.fid==id)[0].response
}

function getOption(resp,id){
     return resp["responses"].filter(ele=>ele.fid==id)[0].oid
}

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

formrouter.post("/getbyEmail",async (req,res)=>{
         const con=await mongoose.connection
         const collection =con.db.collection("myforms_forms")
         const data=req.body  
         var all;
         var rc;
         await collection.find({"user":data.user},async (err,dt)=>{
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
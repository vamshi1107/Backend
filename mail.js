const nodemailer=require('nodemailer')
const express=require("express")
const cors=require('cors')

const app=express()
app.use(cors({}))


const emailRouter=express.Router()

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'projectmail.services@gmail.com',
      pass: 'Avk1234.'
    }
  });
  
  var mailOptions = {
    from: 'projectmail.services@gmail.com',
    subject: 'Mail Service', 
  };

  emailRouter.get("/",(req,res)=>{
            res.send("send email"+req.query.body);
  })

  emailRouter.get("/send",(req,res)=>{
      mailOptions["to"]=req.query.to
      mailOptions["html"]="<b>"+req.query.body+"</b>"
      if(req.query.subject){
          mailOptions["subject"]=req.query.subject
      }
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            res.send(error);
        } else {
          res.send(true);
        }
      });
      
  })
 

module.exports=emailRouter
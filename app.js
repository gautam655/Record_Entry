if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express=require('express');
const app=express();
const path=require('path');
const mongoose=require('mongoose');
const Visitor=require('./models/visitor');

const methodOverride = require('method-override');



mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('DB Connected'))
    .catch((err) => console.log(err));


    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, 'views'));
    app.use(express.urlencoded({ extended: true }));
    app.use(methodOverride('_method'));
    app.use(express.static(path.join(__dirname,'public')))

let mail="";
app.get('/',(req,res)=>{
    res.render('home');
})

app.get('/checkin',async(req,res)=>{
    

    
    const data=await Visitor.find({});
    res.render('checkin',{data,mail});
})


app.post('/checkin',async (req,res)=>{
    const {name,email,phone,address}=req.body;
    mail=email;
    checkinmail(name,email);

   await Visitor.create({name,phone,email,address});
    res.redirect('/checkin');
})

app.delete('/checkout/:id',async(req,res)=>{
    const {id}=req.params;
    console.log(id);

    const {email}=await Visitor.findById(id);
    console.log(email);
    checkoutmail(email);

    await Visitor.findByIdAndDelete(id);
    res.redirect('/');
})
app.listen(process.env.PORT || 2424,(req,res)=>{
    console.log("Server is live at port 2424");
})



function checkinmail(name,email){
    const sgMail=require('@sendgrid/mail');
   const  sendgrid=process.env.API_KEY;
  sgMail.setApiKey(sendgrid);
  const d=new Date();
 
  const msg={
      to: email,
      from: process.env.MY_MAIL,
      subject:"Entering office",
      text:`Hey ${name} welcome to our office you entered the office at ${d}`,
      html:`<h1>Hey ${name} welcome to our office</h1> <strong>you entered the office on ${d} </strong>`
  };
  sgMail.send(msg)
  .then(()=>{
      console.log('mail sent')
  })
  .catch((err)=>{
      console.log(err);
  })
}


function checkoutmail(email){
    const sgMail=require('@sendgrid/mail');
   const  sendgrid=process.env.API_KEY;
  sgMail.setApiKey(sendgrid);
  const d=new Date();
 
  const msg={
      to: email,
      from: process.env.MY_MAIL,
      subject:"Leaving building",
      text:` You checked out the building on ${d}`
      
  };
  sgMail.send(msg)
  .then(()=>{
      console.log('mail sent')
  })
  .catch((err)=>{
      console.log(err);
  })
}
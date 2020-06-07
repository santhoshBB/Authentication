const express = require('express');
var exphbs  = require('express-handlebars');
const mongoose=require("mongoose");
const flash= require("connect-flash");
const session=require("express-session");
const passport =require("passport");



const app = express();

const url="mongodb+srv://santhosh:12345678ss$@cluster0-qewoj.mongodb.net/<dbname>?retryWrites=true&w=majority";

require("./config/passport")(passport);


app.use(express.static(__dirname+"/public"));

mongoose.connect(url,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true,
}).then(()=>console.log("DB connected")).catch(err=>console.log(err));


app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(express.urlencoded({extended:false}));

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
   
  }))

  app.use(flash());


  // passport middleware
app.use(passport.initialize());
app.use(passport.session());

  app.use((req,res,next)=>{
    res.locals.success_msg=req.flash("success_msg");
    res.locals.error_msg=req.flash("error_msg");
    res.locals.error=req.flash("error")
    // res.locals.text= text
    next();
  })

app.get("/",(req,res)=>{
    res.render("welcome")
})



app.use ("/users",require("./routes/routes"));

app.listen(5000, console.log(`Server started on port 5000`));
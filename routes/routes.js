const express = require('express');
const router = express.Router();
const bcrypt=require("bcrypt");
const passport=require("passport");

const userSch=require("../model/users");
const {ensureAuthenticated}=require("../config/auth");


router.get("/login",(req,res)=>{
    res.render("login");
})
router.get("/register",(req,res)=>{
    res.render("register");
})

router.get("/dashboard",ensureAuthenticated,(req,res)=>{
    res.render("dashboard");
})


router.post("/register",(req,res)=>{
    const {name,email,password,password2}=req.body;


    var arry=[];
    // console.log(arry);
    
    // validation
    if(!name || !email || !password || !password2) {
       arry.push({text:`Please fill out all fields`});
    }
     
    if(password !== password2){
        arry.push({text:"passwords do not match"});
    }
    if(password.length<6){
        arry.push({text:"password must be atleast 6charecteristics"});
    }
    if(arry.length>0){
        res.render("register",{
            arry,
            name,
            email,
            password,
            password2
        })

    } else {
    //   validation passed
     userSch.findOne({email:email}).then(user=>{
         if (user){
            arry.push({text:"email already taken or registerred"})
             res.render("register",{
                errors,
                name,
                email,
                password,
                password2
             })
         } else{
            //  save to db
            const newUser= new userSch({
                name,email,password,
            })
            // hash the password
            bcrypt.genSalt(10,(err,salt)=> bcrypt.hash(newUser.password,salt,(err,hash)=>{
                if (err) throw err;
                // hash passord
                newUser.password=hash;

                newUser.save().then(data=>{
                    req.flash('success_msg',"you are registered")
                    res.redirect("/users/login");
                }).catch(err=>console.log(err))
            }))
         }
     }).catch(err=>console.log(err))
    }
})

// Login handle similar refer passportjs

router.post("/login", (req,res,next)=>{
    passport.authenticate('local',{
        successRedirect:"/users/dashboard",
        failureRedirect:"/users/login",
        failureFlash:true
    })
    (req,res,next);
})


// logout handle
router.get("/logout",(req,res)=>{
    req.logOut();
    req.flash("success_msg","you're now loggedout")
    res.redirect("/users/login")
})
module.exports=router;

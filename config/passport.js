const localStrategy=require("passport-local").Strategy;
const mongoose=require("mongoose");
const bcrypt=require("bcrypt");

// load user model
const user=require("../model/users");

module.exports=(passport)=>{
    passport.use(
        new localStrategy({usernameField:'email'},(email,password,done)=>{
            // match user
            user.findOne({email:email})
            .then(user=>{
                if(!user){
                    return done(null,false,{message:"email is not valid"})
                }

            //  match password
            bcrypt.compare(password, user.password, (err, isMatch )=>{
                if (err) throw err;
                if(isMatch){
                    return done(null,user)
                } else{
                    return done(null, false,{message:"password doesnt match"})
                }
            })
            })
            .catch(err=>console.log(err))

    })) 
    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
      
      passport.deserializeUser(function(id, done) {
        user.findById(id, function(err, user) {
          done(err, user);
        });
      });
}
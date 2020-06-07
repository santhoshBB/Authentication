module.exports={
    ensureAuthenticated:function(req,res,next){
        if(req.isAuthenticated()){
            return next();
        }
        req.flash("error_msg","please login to view this content");
        res.redirect("/users/login")
    }
    // forwardAuthenticated: function(req, res, next) {
    //     if (!req.isAuthenticated()) {
    //       return next();
    //     }
    //     res.redirect('/dashboard');      
    //   }
}
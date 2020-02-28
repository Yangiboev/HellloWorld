const   express          = require("express");
const   router           = express.Router(),
        passport         = require("passport"),
        middleWare       = require("../middleWare"),
        User             = require("../models/user");

//===================================
//AUTHENTICATE
//===================================
router.get("/",function(req,res){
  res.render("index");
});

router.post("/register",function(req,res){
  var newUser = new User({username: req.body.username, email: req.body.email });
    User.register(newUser, req.body.password,function(err, newUser){
      if (err) {
        // req.flash("error", err.message);
        console.log(err);
        return res.render("register");
      }
      passport.authenticate("local")(req,res,function(){
        req.flash("success", req.body.username);
        res.redirect("/");
      });
    });
});
router.post("/login", passport.authenticate("local",{
  successRedirect:"/",
  failureRedirect: "/login",
  badRequestMessage : 'Incorrect username or password.',
  failureFlash: true
}),function(req,res){
  res.send("Login happens here!");
});
router.get("/logout",function(req,res){
  req.logout();
  req.flash("error","Logged you out!");
  res.redirect("/");
});
module.exports = router;

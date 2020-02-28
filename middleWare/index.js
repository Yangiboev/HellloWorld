var middleWareObject={};

middleWareObject.isLoggedIn = function(req,res,next){
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error","Please Log in first!");
  res.redirect("/login");
};
module.exports = middleWareObject;

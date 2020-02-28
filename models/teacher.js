var mongoose=require("mongoose");

var teacherSchema=mongoose.Schema({
  id: Number,
  name:String,
  surname:String,
  level:Number,
  salary: Number,
  students:Number,
});
module.exports= mongoose.model("Teacher",teacherSchema);

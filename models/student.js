var mongoose=require("mongoose");

var studentSchema=mongoose.Schema({
  name:String,
  teachers:String,
  level:Number,
  month: Number,
  age:Number,
});
module.exports= mongoose.model("Student",studentSchema);

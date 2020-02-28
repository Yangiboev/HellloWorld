const   express          = require("express");
const   router           = express.Router(),
        passport         = require("passport"),
        xlsx             = require("xlsx"),
        TeacherInfo      = require("../models/teacher"),
        StudentInfo      = require("../models/student"),
        middleWare       = require("../middleWare");

var   wb = xlsx.readFile("./Dell.xlsx", {  type:'buffer' } ),
      ws1 = wb.Sheets['TeacherInfo'],
      ws2 = wb.Sheets['StudentInfo'];

var  TeacherData = xlsx.utils.sheet_to_json(ws1);
var  StudentData = xlsx.utils.sheet_to_json(ws2);


router.get("/save",function(req,res){
  for (var i = 0; i < TeacherData.length; i++) {
    var Teacher = {  name:TeacherData[i].Teacher_name, surname:TeacherData[i].Teacher_surname, level:TeacherData[i].Teacher_level, salary:TeacherData[i].Teacher_salary, students:TeacherData[i].Teacher_stu };
    // var Student = { id: StudentData[i].Student_id , name:StudentData[i].Student_name, teachers:StudentData[i].Student_Tacher, level:StudentData[i].Student_level, month:StudentData[i].Student_duration, age:StudentData[i].Student_age };
    TeacherInfo.create(Teacher,function(err,Added){
        if (err) {
          console.log("Not Found");
        }else{
          console.log(Added);
        }
      });
    };

  for (var i = 0; i < StudentData.length; i++) {
    var Student = {  name:StudentData[i].Student_name, teachers:StudentData[i].Student_Teacher, level:StudentData[i].Student_level, month:StudentData[i].Student_duration, age:StudentData[i].Student_age };
    StudentInfo.create(Student,function(err,Added){
      if (err) {
        console.log("Not Found");
      }else{
        console.log(Added);
      }
    });
  };
  res.redirect("/teachers" );
});

router.get("/teachers", function(req,res){
  TeacherInfo.find({},function(err,data){
    if(err){
      console.log("Not Found");
    }else{
    res.render("teacher",{ teacher : data});
    // console.log(data);
  }
  });
});
router.get("/students", function(req,res){
  StudentInfo.find({},function(err,data){
    if(err){
      console.log("Not Found");
    }else{
    res.render("student",{ student : data });
    // console.log(data);
  }
  });
});
router.get("/students/:number", function(req,res){
  StudentInfo.find({age: { $gt: req.params.number }},function(err,data){
    if(err){
      console.log("Not Found");
    }else{
console.log(data);
    res.render("student",{ student : data });
    // console.log(data);
  }
  });
});
router.get("/:title/new", function(req,res){
  if (req.params.title === 'teacher') {
    res.render("newTeacher");
  }else{
    res.render("newStudent");
  }
});
router.post("/:title/new",function(req,res){
  if (req.params.title === 'teacher') {
    console.log("I am teacher");
    var name = req.body.name;
    var surname = req.body.surname;
    var level = req.body.level;
    var salary = req.body.salary;
    var students = req.body.students;

    var newTeacher = {name:name, surname: surname, level:level, students:students, salary:salary };
    TeacherInfo.create(newTeacher,function(err,newTeacher){
      if (err) {
        console.log("Not Found");
      }else{
        console.log("newlyAdded");
        res.redirect("/teachers");
      }
    });
  }else{

    var name = req.body.name;
    var teachers = req.body.teachers;
    var level = req.body.level;
    var age = req.body.age;
    var month = req.body.month;
    var newStudent = { name:name, teachers:teachers, level:level, age:age, month:month };
    StudentInfo.create(newStudent,function(err,newStudent){
      if (err) {
        console.log("Not Found");
      }else{
        res.redirect("/students");
      }
    });

  }
});

router.get("/:title/excel", function(req,res){

  if (req.params.title === 'teacher') {

    TeacherInfo.find({},function(err,data){
      if(err){
        console.log("Not Found");
      }else{
        console.log("hello");
        var idea = [];
        idea = data;
        var newData = idea.map(function(record){
          // console.log(record);
          record.Teacher_name = record.name;
          record.Teacher_surname = record.surname;
          record.Teacher_level = record.level;
          record.Teacher_salary = record.salary;
          record.Teacher_stu = record.students;
          record.$__= record.id;
          // delete  record.$__;
          delete  record.isNew;
          delete  record.errors;
          delete  record._doc;
          delete  record.$locals;
          delete  record.$op;
          delete  record.$init;
          return record;
        });
        // console.log(newData);
        var NewWb = xlsx.utils.book_new();
        var NewWs = xlsx.utils.json_to_sheet(newData);
        xlsx.utils.book_append_sheet(NewWb,NewWs,"TeacherInfo");
        xlsx.writeFile(NewWb,"Teacher1.xlsx");
        res.redirect("/teachers");
      }
    });
  }else{
    StudentInfo.find({},function(err,data){
      if(err){
        console.log("Not Found");
      }else{
        var idea = [];
        idea = data;
        var newData = idea.map(function(record){
          record.Student_name = record.name;
          record.Student_Teacher = record.teachers;
          record.Student_level = record.level;
          record.Student_salary = record.salary;
          record.Student_age = record.age;
          record.$__= record.id;
          // delete  record.$__;
          delete  record.isNew;
          delete  record.errors;
          delete  record._doc;
          delete  record.$locals;
          delete  record.$op;
          delete  record.$init;
          return record;
        });
        // console.log(newData);
        var NewWb = xlsx.utils.book_new();
        var NewWs = xlsx.utils.json_to_sheet(newData);
        xlsx.utils.book_append_sheet(NewWb,NewWs,"StudentInfo");
        xlsx.writeFile(NewWb,"Student.xlsx");
        res.redirect("/students");
      }
    });
  }
});
router.get("/download/wellDone/:title", function(req, res){
  if(req.params.title === 'teacher'){

    const file = `${__dirname}/../Teacher1.xlsx`;
    res.download(file);

  }else{
    const file = `${__dirname}/../Student.xlsx`;
    res.download(file);
  }
});
router.get("/:title/:id", function(req,res){
  if (req.params.title === 'teacher') {
  TeacherInfo.findById(req.params.id,function(err,foundTeacher){
    if (err) {
      console.log("adw");
      res.redirect("/");
    }else{
      res.render("teacherView",{teacher:foundTeacher, student: StudentData});
    }
  });
  }else{
    StudentInfo.findById(req.params.id,function(err,foundStudent){
      if (err) {
        console.log("some");

        res.redirect("/");
      }else{
        res.render("studentView",{student:foundStudent});
      }
    });
  }
});
//EDIT
router.get("/:title/:id/edit", function(req,res){
  if (req.params.title === 'teacher') {
    TeacherInfo.findById(req.params.id,function(err,foundTeacher){
      if (err) {
        console.log("low");

        res.redirect("/");
      }else{
        res.render("edit",{teacher:foundTeacher});
      }
    });
  }else{
    StudentInfo.findById(req.params.id,function(err,foundStudent){
      if (err) {
        console.log("was");

        res.redirect("/");
      }else{
        res.render("editStudent",{student:foundStudent});
      }
    });
  }
});

router.delete("/:title/:id",function(req,res){
  if (req.params.title ==='teacher') {
    TeacherInfo.findByIdAndRemove(req.params.id, function(err){
      if (err) {
        res.redirect("/");
      }else{
        console.log(req.params.id+ req.params.title);
        res.redirect("/teachers");
      }
    });
  }else{
    StudentInfo.findByIdAndRemove(req.params.id, function(err){
      if (err) {
        console.log("idn");
        res.redirect("/");
      }else{

        res.redirect("/students");
      }
    });
  }
});
router.put("/:title/:id",function(req,res){
  if (req.params.title ==='teacher') {
    TeacherInfo.findByIdAndUpdate(req.params.id, req.body.teacher, function(err,updated){
      if (err) {
        console.log("iis");

        res.redirect("/");
      }else{
        console.log("Done");
        res.redirect("/teacher/"+ req.params.id);
      }
    });
  }else{
    StudentInfo.findByIdAndUpdate(req.params.id, req.body.student, function(err,updated){
      if (err) {
        console.log("inn");

        res.redirect("/");
      }else{
        console.log("Done");
        res.redirect("/student/"+ req.params.id);
      }
    });
  }
});

router.get("/teachers", function(req,res){
  TeacherInfo.find({},function(err,data){
    if(err){

      console.log("Not Found");
    }else{
    res.render("teacher",{ teacher : data});
    // console.log(data);
  }
  });
});

module.exports = router;

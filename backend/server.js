const express = require('express');
const db = require('./config/db')
const cors = require('cors')

const app = express();
const  PORT = 3002;
app.use(cors());
app.use(express.json())

db.connect(function(err) {
    if (err) {
      return console.error('error: ' + err.message);
    }
    console.log('Connected to the MySQL server.');
});

app.get('/', function(req, res){
  var root = {};
  root.status = 'success';
  root.method = 'index';
  var json = JSON.stringify(root);
  res.send(json);
});

app.post('/cors', function(req, res) {
  var root = {};
  root.status = 'success';
  root.method = 'cors';
  var json = JSON.stringify(root);
  res.send(json);
})

// Route to get all courses
app.get("/api/getcourses", (req,res)=>{
  db.query("SELECT * FROM courseContent", (err,result)=>{
    if(err) {
      console.log(err);
    } 
    res.send(result);
  });   
});


// Route for adding a course
app.post('/api/createcourse', (req,res)=> {

  const CourseName = req.body.CourseName;
  const CourseURL = req.body.CourseURL;
  const ImageURL = req.body.ImageURL;

  db.query("INSERT INTO courseContent (CourseName, CourseURL, ImageURL) VALUES (?, ?, ?, ?)",[CourseName, CourseURL, ImageURL], (err,result)=>{
    if(err) {
      console.log(err);
    } 
    res.send(result);
  });   
});

// Route for updating a course
app.put('/api/updatecourse', (req,res)=> {

  console.log("Update", req.body)

  const CourseID = req.body.id;
  const CourseName = req.body.CourseName;
  const CourseURL = req.body.CourseURL;
  const ImageURL = req.body.ImageURL;

  db.query("UPDATE courseContent SET CourseName = ?, CourseURL = ?, ImageURL = ? WHERE ID = ?",[CourseName, CourseURL, ImageURL, CourseID], (err,result)=>{
    if(err) {
      console.log(err);
    } 
    res.send(result);
  });   
});

// Route for deleting a course
app.delete('/api/deletecourse/:id', (req,res)=> {

  const CourseID = req.params.id;

  db.query("DELETE FROM courseContent WHERE ID=?", [CourseID], (err,result)=>{
    console.log("RESULT", result)
    if(err) {
      console.log(err);
    } 
    res.send(result);
  });   
});

app.listen(PORT, ()=>{
    console.log("Server is running on: ", {PORT})
})
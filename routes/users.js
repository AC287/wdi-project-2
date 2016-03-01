'use strict'
var express = require('express');
var users = express.Router();
var bodyParser = require('body-parser');
var db = require('./../db/pg'); //include database;

users.get('/', (req, res) => {
  res.redirect('./../');
});

users.get('/new', (req, res) => {
  res.render('new');
});

//New user need to reroute back to welcome and user page. Else, conflicting with login.
users.post('/welcome', db.createUser, function(req, res){
  res.redirect('/');
});

users.get('/login', (req, res) => {
  res.render('login');
});

users.post('/home', db.loginUser, function(req,res){
  req.session.user = res.rows;
  // res.send('WELCOME ' + res.rows.name);
  req.session.save(function(){
    // console.log(res.rows);
    if (res.rows.role==='2'){
      res.render('thome', {displayUser: res.rows});
    }
    else {
      res.render('shome', {displayUser: res.rows});
    }
  });
});

users.post('/editgrades', db.studentData, function(req,res){
  console.log(res);
  // res.send(res.data);
  res.render('studentData', {displayStudent: res.data});
});
users.delete('/editgrades/:id',db.deleteStudent, function(req,res){
  res.redirect('/');
});
users.get('/assignment', (req,res)=>{
  // console.log(req);
  res.render('addassignment');
});
users.post('/addassignment', db.assignmentData, function(req, res){
  res.render('/editgrades2', {
    displayStudent: res.data,
    displayAssignment: res.assignment
  });
  // res.send(res.assignment);
})

users.delete('/logout', function(req,res){
  req.session.destroy(function(err){
    res.redirect('./')
  })
})


module.exports = users;

'use strict'
var express = require('express');
var users = express.Router();
var bodyParser = require('body-parser');
var db = require('./../db/pg');

users.get('/', (req, res) => {
  res.redirect('./../');
});

users.get('/new', (req, res) => {
  res.render('new');
});

users.post('/welcome', db.createUser, function(req, res){
  res.redirect('/');
});

users.get('/login', (req, res) => {
  res.render('login');
});

users.post('/home', db.loginUser, function(req,res){
  req.session.user = res.rows;
  req.session.save(function(){
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
  res.render('studentData', {displayStudent: res.data});
});

users.delete('/editgrades/:id',db.deleteStudent, function(req,res){
  res.redirect('/');
});

users.get('/assignment', (req,res)=>{
  res.render('addassignment');
});

users.post('/addassignment', db.assignmentData, function(req, res){
  res.render('/editgrades2', {
    displayStudent: res.data,
    displayAssignment: res.assignment
  });
})

users.delete('/logout', function(req,res){
  req.session.destroy(function(err){
    res.redirect('./')
  })
})


module.exports = users;

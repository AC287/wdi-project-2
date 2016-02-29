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
    res.render('home', {displayUser: res.rows});
  });
});

users.delete('/logout', function(req,res){
  req.session.destroy(function(err){
    res.redirect('/')
  })
})
module.exports = users;

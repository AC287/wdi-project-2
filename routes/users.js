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
    console.log(res.rows);
    if (res.rows.role==='2'){
      res.render('thome', {displayUser: res.rows})
    }
    else {
      res.render('shome', {displayUser: res.rows});
    }
  });
});

users.post('/editgrades', db.studentData, function(req,res){
  console.log(res.data);
  // res.send(res.data);
  res.render('studentData', {displayStudent: res.data});
})

users.delete('/logout', function(req,res){
  req.session.destroy(function(err){
    res.redirect('/')
  })
})
module.exports = users;

//   <% displayStudent[i].forEach(student){ %>
//     <tr>
//       <td><%= student.img_url %></td>
//       <td><%= student.name %></td>
//       <td><%= student.email %></td>
//       <td><%= student.class_code %></td>
//     </tr>
//     <% } %>
// <% } %>

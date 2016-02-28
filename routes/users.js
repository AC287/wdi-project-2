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

users.post('/home', db.createUser, function(req, res){
  res.redirect('/');
})

users.get('/login', (req, res) => {
  res.render('login');
});

module.exports = users;

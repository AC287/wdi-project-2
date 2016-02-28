'use strict'
//This is project 2
var express = require('express');
var app = express();
var morgan = require('morgan');
var bodyParser = require('body-parser');
var pg = require('pg');
var config = "postgres://arthurchen:Helloworld01@localhost/gradingbook";
var session = require('express-session');
var pgSession = require('connect-pg-simple')(session);
var path = require('path');
var methodOverride = require('method-override');
// var ejs = require('ejs');
var db = require('./db/pg');


var session = require('express-session');
var pgSession = require('connect-pg-simple')(session);

var userRoutes = require(path.join(__dirname, '/routes/users'))

var port = process.env.PORT || 3210;

app.use(session({
  store: new pgSession({
    pg: pg,
    conString: config,
    tableName: 'session'
  }),
  secret: 'this_is_secret', //way of security.
  resave: false,
  cookie: {maxAge: 30*24*60*60*1000} // 30 days
}))

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(morgan('short'));

app.use(methodOverride('_method'))

app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
  res.render('index');
});

app.use('/users', userRoutes);


var server = app.listen(port);

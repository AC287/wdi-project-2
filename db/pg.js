//PROJECT 2
var pg = require('pg');
var config = "postgres://arthurchen:Helloworld01@localhost/gradingbook";
var bcrypt = require('bcrypt');
var salt = bcrypt.genSaltSync(10);
var session = require('express-session');

function loginUser(req, res, next) {
  var email = req.body.email;
  var password = req.body.password;

  pg.connect(config, function(err, client, done) {
    if(err) {
      done()
      console.log(err)
      return res.status(500).json({success: false, data: err})
    }
    var query = client.query("SELECT * FROM users WHERE email LIKE ($1);", [email], function(err, result){
      done();
      if(err){
        return console.error('Error running query', err);
      }
      if(result.rows.length===0){
        res.status(204).json({success: true, data: 'no content'})
      } else if(bcrypt.compareSync(password, result.rows[0].password_digest)){
        res.rows = result.rows[0];
        console.log(res.rows);
        next()
      }
    });
  });
};

function createSecure(email, password, callback) {
  bcrypt.genSalt(function(err, salt){
    bcrypt.hash(password, salt, function(err, hash){
      callback(email,hash)
    })
  })
}

function createUser(req, res, next) {

  createSecure(req.body.email, req.body.password, saveUser);

  function saveUser(email, hash){
    // console.log(req.body);

    //Assign role:
    var role;
    var roleClass = req.body.class_code;
    roleClass = roleClass.toLowerCase();
    // console.log(roleClass);
    if(roleClass[roleClass.length-2]==='p' && roleClass[roleClass.length-1]==='t'){
      role = 2; // set as teacher
      roleClass = roleClass.split('');
      roleClass.splice(roleClass.length-2,2);
      roleClass = roleClass.join('');
    } else {
      role = 3; // set as student
    };

    //enter value
    pg.connect(config, function(err, client, done){
      if(err){
        done()
        console.log(err)
        return res.status(500).json({success:false, data: err})
      };
      client.query("INSERT INTO users(name, email, password_digest, img_url, class_code, role) VALUES($1,$2,$3,$4,$5,$6)",[req.body.name, email, hash, req.body.img_url, roleClass, role], function(err, result){
        done()
        if(err){
          return console.log('Error running query',err);
        }
        next()
      });
    });
  };
};

function studentData(req, res, next) {
  pg.connect(config, function(err, client, done) {
    if(err) {
      done()
      console.log(err)
      return res.status(500).json({success: false, data: err})
    };
    client.query("SELECT * FROM users WHERE role='3' ORDER BY name;", function(err, result){
      done();
      if (err){
        return console.error('Error running query',err);
      }
      res.data = result.rows;
      console.log(res.data)
      next();
    });
  });
};

module.exports.createUser = createUser;
module.exports.loginUser = loginUser;
module.exports.studentData = studentData;

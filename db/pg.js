//PROJECT 2
var pg = require('pg');

if(!process.env.ENVIRONMENT){
  require('dotenv').config();
}

if (process.env.ENVIRONMENT === 'production') {
  var config = process.env.DATABASE_URL;
} else {
  var config = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS
  };
};
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
    var role;
    var roleClass = req.body.class_code;
    roleClass = roleClass.toLowerCase();
    if(roleClass[roleClass.length-2]==='p' && roleClass[roleClass.length-1]==='t'){
      role = 2; // set as teacher
      roleClass = roleClass.split('');
      roleClass.splice(roleClass.length-2,2);
      roleClass = roleClass.join('');
    } else {
      role = 3; // set as student
    };

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
      next();
    });
  });
};

function assignmentData(req,res,next) {
  var assignmentid;
  var eachStudent;
  pg.connect(config, function(err, client, done) {
    if(err) {
      done()
      console.log(err)
      return res.status(500).json({success: false, data: err})
    };
    client.query('INSERT INTO assignments (name) VALUES ($1) RETURNING id',[req.body.name], function(err, result){
      done();
      if(err){
        console.log('Error with query', err);
      }
      assignmentid = result.rows[0].id;
      res.assignment = {'id': assignmentid,
                        'name': req.body.name};
    })
    //add assignment to each user;
    client.query('SELECT id FROM users where role=$1 and class_code like $2',['3',req.body.class_code], function(err, result) {
      eachStudent = result.rows;
      done();
      if(err) {
        console.error('Error with query', err);
      }
      for(var i=0; i<eachStudent.length; i++) {
        client.query('INSERT INTO users_assignments (user_id, assignment_id) VALUES ($1,$2)',[eachStudent[i].id, assignmentid], function(err, results){
          if (err) {
            console.error('Error with query', err);
          }
          done();
        })
      }
    })
    //extract specific value from joined table;
    client.query('SELECT users.img_url as img_url, users.id as userid, users.name as username, users.class_code as class, assignments.name as assignmentname, assignments.grade as assignmentgrade from users left join users_assignments on users.id = users_assignments.user_id left join assignments on users_assignments.assignment_id=assignments.id;', function(err, results) {
      done();
      if (err) {
        console.error('Error with query', err);
      }
      res.data = results.rows;
    })
  })
}

function deleteStudent (req, res, next) {
  pg.connect(config, function(err, client, done){
    if (err) {
      done();
      console.log(err);
      res.status(500).json({success: false, data: err});
    }
    client.query('DELETE FROM users WHERE id = $1;',[req.params.id], function(err,results){
      done();
      if (err) {
        console.error('Error with query', err);
      }
      next();
    });
  });
};

module.exports.createUser = createUser;
module.exports.loginUser = loginUser;
module.exports.studentData = studentData;
module.exports.assignmentData = assignmentData;
module.exports.deleteStudent = deleteStudent;

var express = require('express');
var mysql = require('mysql');
var bcrypt = require('bcrypt');
var router = express.Router();

var connection = mysql.createConnection({
  host: '127.0.0.1',
  port: 3306,
  user: 'root',
  password: '$manso1007',
  database: 'manso_table'
});

// Connect
connection.connect(function (err) {
  if (err) {
    console.error('mysql connection error');
    console.error(err);
    throw err;
  }
});

router.post('/register', function (req, res) {
  const user = {
    'userid': req.body.user.userid,
    'name': req.body.user.name,
    'password': req.body.user.password
  };
  connection.query('SELECT userid FROM users WHERE userid = "' + user.userid + '"', function (err, row) {
    if (row[0] == undefined){ //  동일한 아이디가 없을경우,
      const salt = bcrypt.genSaltSync();
      const encryptedPassword = bcrypt.hashSync(user.password, salt);

      connection.query('INSERT INTO users (userid,name,password) VALUES ("' + user.userid + '","' + user.name + '","' + encryptedPassword + '")', user, function (err, row2) {
        if (err) {
            throw err;
        }
      });

      res.json({
        success: true,
        message: 'Sing Up Success!'
      })
    } else {
      res.json({
        success: false,
        message: 'Sign Up Failed Please use anoter ID'
      })
    }
  });
});

router.post('/login', function (req, res) {
  const user = {
    'userid': req.body.user.userid,
    'password': req.body.user.password
  };
  connection.query('SELECT userid, password FROM users WHERE userid = "' + user.userid + '"', function (err, row) {
    if (err) {
      res.json({ // 매칭되는 아이디 없을 경우
        success: false,
        message: '등록되지 않은 아이디 입니다.'
      })
    }
    if (row[0] !== undefined && row[0].userid === user.userid) {
      bcrypt.compare(user.password, row[0].password, function (err, res2) {
        if (res2) {
          res.json({ // 로그인 성공
            success: true,
            message: '로그인 되셨습니다.',
            userid: row[0].userid,
            name: row[0].name
          })
        }
        else {
          res.json({ // 매칭되는 아이디는 있으나, 비밀번호가 틀린 경우
            message: '비밀번호가 잘못 되었습니다.'
          })
        }
      })
    }
  })
});

module.exports = router;

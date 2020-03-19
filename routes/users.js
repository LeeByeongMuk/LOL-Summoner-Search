const express = require('express');
const mysql = require('mysql');
const router = express.Router();
const crypto = require('crypto');

const dbConfig = require('../config.js');
const connection = mysql.createConnection(dbConfig.SQL);
const secret = dbConfig.KEY.secret;
let User = require('../models/user');

router.post('/register', (req, res) => {
    const hash = crypto.createHmac('sha256', secret)
        .update(req.body.user.password)
        .digest('base64');

    User.user_id = req.body.user.userId;
    User.user_password = hash;
    User.user_name = req.body.user.name;

    if (User.user_id && User.user_password && User.user_name) {
        connection.query('SELECT user_id From users WHERE user_id = "' + User.user_id + '"', function (err, row, fields) {
            if (row.length == 0) {
                connection.query('INSERT INTO users (user_id, user_password, user_name) VALUES ("' + User.user_id + '", "' + User.user_password + '", "' + User.user_name + '")', function (err, row2, fields) {
                    if (err) {
                        console.log(err);
                    }

                    res.json({
                        'status': 200,
                        'message': '회원가입 되었습니다.'
                    });
                });
            } else {
                res.json({
                    'status': 400,
                    'message': '중복된 아이디 입니다.'
                });
            }
        })
    } else {
        res.json({
            'status': 400,
            'message': '값을 입력해 주세요.'
        })
    }
});

router.post('/login', function (req, res) {
    // login
});

module.exports = router;

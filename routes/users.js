const express = require('express');
const mysql = require('mysql');
const router = express.Router();
const crypto = require('crypto');

const dbConfig = require('../config.js');
const connection = mysql.createConnection(dbConfig.SQL);
const secret = dbConfig.KEY.secret;
let User = require('../models/user');

var app = express();

router.post('/register', function (req, res) {
    const hash = crypto.createHmac('sha256', secret)
        .update(req.body.password)
        .digest('base64');

    User.user_id = req.body.user_id;
    User.user_password = req.body.hash;
    User.user_name = req.body.user_name;
    console.log(User);

    if (User.user_id && User.user_password && User.user_name) {
        connection.query('SELECT user_id From users WHERE user_id = "${User.user_id}"', function (err, res, fields) {
            if (res.length == 0) {
                connection.query('INSERT INTO users (user_id, user_password, user_name) VALUES ("${User.user_id}"), "${User.user_password}", "${User.user_name}"', function (err, res2, fields) {
                    if (err) {
                        console.log(err);
                    }

                    res.status(200).json({
                        'status': 200,
                        'message': 'success'
                    });
                });
            } else {
                res.status(400).json({
                    'status': 400,
                    'message': '중복된 아이디 입니다.'
                });
            }
        })
    } else {
        res.status(400).json({
            'status': 400,
            'message': '값을 입력해 주세요.'
        })
    }
});

router.post('/login', function (req, res) {
    // login
});

module.exports = router;

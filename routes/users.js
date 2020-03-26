const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const crypto = require('crypto');
var jwt = require('jsonwebtoken');

const dbConfig = require('../config.js');
const connection = mysql.createConnection(dbConfig.SQL);
const secret = dbConfig.KEY.secret;
let User = require('../models/user');

router.post('/register', (req, res) => {
    const hash = crypto.createHmac('sha256', secret)
        .update(req.body.user.password)
        .digest('base64');

    User.user_id = req.body.user.id;
    User.user_password = hash;
    User.user_name = req.body.user.name;

    if (User.user_id && User.user_password && User.user_name) {
        connection.query(`SELECT user_id From users WHERE user_id = "${User.user_id}"`,
        function (err, result, fields) {
            if (result.length == 0) {
                connection.query(`INSERT INTO users (user_id, user_password, user_name) VALUES ("${User.user_id}", "${User.user_password}", "${User.user_name}")`, function (err, result2, fields) {
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
    User.user_id = req.body.user.id;
    User.user_password = req.body.user.password
    let jwt_secret = 'manso';

    if (User.user_id) {
        connection.query(`SELECT id, user_password, user_name From users WHERE user_id = "${User.user_id}"`,
        function (err, result, fields) {
            if (err) {
                console.log(err)
            }

            const hash = crypto.createHmac('sha256', secret)
                .update(req.body.user.password)
                .digest('base64');
            User.user_name = result[0].user_name;

            if (hash == result[0].user_password) {
                const getToken = new Promise((resolve, reject) => {
                    jwt.sign({
                        id: result[0].id,
                        userId: User.user_id,
                        name: User.user_name
                    }, jwt_secret, {
                        expiresIn: '7d',
                        issuer: 'manso',
                        subject: 'userInfo'
                    }, (err, token) => {
                        if (err) {
                            reject(err)
                        }
                        resolve(token)
                    })
                });

                getToken.then(token => {
                    res.status(200).json({
                        'status': 200,
                        'message': '로그인 되었습니다',
                        token
                    });
                });
            } else {
                res.status(400).json({
                    'status': 400,
                    'message': '비밀번호가 틀렸습니다'
                });
            }
        });
    } else {
        res.status(400).json({
            'status': 400,
            'message': '등록되지 않은 아이디 입니다'
        })
    }
});

router.get('/check', function (req, res) {
    const token = req.headers['x-access-token'] || req.query.token;
    let jwt_secret = 'manso';

    if (!token) {
        res.status(400).json({
            'status': 400,
            'msg': 'token이 없음'
        });
    }

    const checkToken = new Promise((resolve, reject) => {
        jwt.verify(token, jwt_secret, function (err, decoded) {
            if(err) {
                reject(err);
            }

            resolve(decoded);
        });
    });

    checkToken.then(token => {
        console.log(token);
        res.status(200).json({
            'status': 200,
            'message': 'check success',
            token
        })
    });
});

module.exports = router;

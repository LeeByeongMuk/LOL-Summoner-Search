const express = require('express');
const router = express.Router();
const mysql = require('mysql');

const dbConfig = require('../config.js');
const connection = mysql.createConnection(dbConfig.SQL);
let Notice = require('../models/notice');

router.get('/', function (req, res) {
    connection.query('SELECT * FROM notice', function (err, result) {
        res.json({
            'status': 200,
            'data': result
        })
    })
});

router.post('/create', function (req, res) {
    Notice.userId = req.body.userId;
    Notice.title = req.body.title;
    Notice.contents = req.body.contents;

    if (Notice.title && Notice.contents) {
        connection.query(`INSERT INTO notice (user_id, title, contents) VALUES ('${Notice.userId}', '${Notice.title}', '${Notice.contents}')`, function (err, result) {
            if (err) {
                console.log(err);
            }

            res.json({
                'status': 200,
                'message': '공지사항이 등록 되었습니다.'
            });
        });
    } else {
        res.json({
            'status': 400,
            'message': '값을 입력 해 주세요'
        })
    }
});

module.exports = router;

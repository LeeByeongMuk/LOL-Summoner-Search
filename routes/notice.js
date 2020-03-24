const express = require('express');
const router = express.Router();
const mysql = require('mysql');

const dbConfig = require('../config.js');
const connection = mysql.createConnection(dbConfig.SQL);
let Notice = require('../models/notice');

router.get('/', function (req, res) {
    connection.query('SELECT * FROM notice', function (err, result) {
        console.log(result);

        res.json({
            'status': 200,
            'data': result
        })
    })
});

module.exports = router;

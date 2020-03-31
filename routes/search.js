const express = require('express');
const router = express.Router();
const request = require('request');
const urlencode = require('urlencode');

router.post('/', function(req, res){
    console.log(req.body);

    let summonerName = req.body.summonerName;
    const key = 'RGAPI-79a4e410-a192-4bcd-b6d2-b3ee3c5dcbd8';
    const url = `https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/${urlencode(summonerName)}?app_key=${key}`
    request(url, function(err, response, body){
        if (err) {
            console.log(err);
        }

        console.log(url);
        console.log(body);

        res.json(JSON.parse(body))
    });
});

module.exports = router;

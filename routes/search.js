const express = require('express');
const router = express.Router();
const request = require('request');
const urlencode = require('urlencode');

const key = 'RGAPI-d09d4231-3d7f-45a8-8bd8-c0061f884dea';

router.post('/id', function(req, res){
    let summonerName = req.body.summonerName;
    let url = `https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/${urlencode(summonerName)}?api_key=${key}`;

    request(url, function(err, response, body){
        if (err) {
            console.log(err);
        }
        const data = JSON.parse(body);

        if (data.status == '' || data.status == null || data.status == undefined) {
            res.json(data)
        } else {
            res.json({
                message: '검색 결과가 없습니다.'
            })
        }
    });
});

router.post('/rank', function(req, res) {
    let url = `https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/${urlencode(req.body.id)}?api_key=${key}`;

    request(url, function(err2, response2, body2){
        if (err2) {
            console.log(err2);
        }

        res.json(JSON.parse(body2));
    });
});

module.exports = router;

const express = require('express');
const router = express.Router();
const request = require('request');
const urlencode = require('urlencode');

const key = 'RGAPI-a6f4aa29-de84-439a-9560-594d238e4cd6';

router.post('/id', function(req, res){
    let summonerName = req.body.summonerName;
    let url = `https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/${urlencode(summonerName)}?api_key=${key}`;

    request(url, function(err, response, body){
        if (err) {
            console.log(err);
        }
        const data = JSON.parse(body);

        if (data.status == '' || data.status == null || data.status == undefined) {
            url = `https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/${urlencode(data.id)}?api_key=${key}`;

            request(url, function(err2, response2, body2){
                if (err2) {
                    console.log(err2);
                }

                res.json(JSON.parse(body2));
            });
        } else {
            res.json({
                message: '검색 결과가 없습니다.'
            })
        }
    });
});

module.exports = router;

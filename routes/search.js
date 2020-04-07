const express = require('express');
const router = express.Router();
const request = require('request');
const urlencode = require('urlencode');

const key = 'RGAPI-b155bfc4-45cb-46ea-b518-1959bd133a65';

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

    request(url, function(err, response, body){
        if (err) {
            console.log(err);
        }

        res.json(JSON.parse(body));
    });
});

router.post('/match', function(req, res) {
    const endIndex = 1;
    const beginIndex = 0;
    let url = `https://kr.api.riotgames.com/lol/match/v4/matchlists/by-account/${urlencode(req.body.id)}?endIndex=${endIndex}&beginIndex=${beginIndex}&api_key=${key}`;

    const getMatch = function(gameId, callback) {
        let url2 = `https://kr.api.riotgames.com/lol/match/v4/matches/${urlencode(gameId)}?api_key=${key}`;

        request(url2, function(err2, response2, body2) {
            if (err2) {
                console.log(err2);
            }

            return callback(JSON.parse(body2));
        })
    };

    // const getData = function(matches, callback) {
    //     for (let value in matches) {
    //         getMatch(matches[value].gameId, function(res) {
    //             rdata[value] = res;
    //         });
    //     }
    //
    // }

    request(url, function(err, response, body){
        if (err) {
            console.log(err);
        }

        let data = [];
        const matchKey = JSON.parse(body);

        for (let value in matchKey.matches) {
            getMatch(matchKey.matches[value].gameId, function(res) {
                data[value] = res;

                console.log(data[value]);
            });
            console.log(data);
        }


        res.json(data);
    });
});

module.exports = router;

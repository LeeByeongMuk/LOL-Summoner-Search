const express = require('express');
const router = express.Router();
const slides = require('../data/slide.json');

router.get('/', function(req, res){
    res.send(slides);
});

router.get('/:id', function(req, res){
    const id = parseInt(req.params.id, 10);
    const slide = slides.filter(function(slide){
        return slide.id === id;
    });
    res.send(slide);
});

module.exports = router;

const express = require('express');
const router = express.Router();

arrayComplete = ["20","19","18","17","16","15","14","13","12","11","10","9","8","7","6","5","4","3","2","1","25"]


router.get('/', function(req, res) {
    res.render('pages/index');
});

router.get('/lobby/01', function(req, res) {
    res.render('pages/lobby/01');
});

router.get('/lobby/crickets', function(req, res) {
    res.render('pages/lobby/crickets');
});

router.get('/lobby/fungames', function(req, res) {
    res.render('pages/lobby/fungames');
});

router.get('/selectionJoueur', function(req, res) {
    let nbPlayer;
    if (req.query.game === "cricket" || req.query.game === "goldHunting") {
        nbPlayer = 4;
    } else {
        nbPlayer = 8;
    }
    res.render('pages/selectionJoueur', {game: req.query.game, nbPlayerMax: nbPlayer});
});

router.get('/game/cricket', function(req, res) {
    res.render('pages/game/cricket', {nbPlayer: req.query.nbPlayer, maxRound: 20, arrayTargets: ["20", "19", "18", "17", "16", "15", "25"], mode: "cricket"});
});

router.get('/game/RandomCricket', function(req, res) {
    let array = [25];
    do {
        let nb = between(1, 20);
        if (!array.includes(nb))
            array.push(nb);
    } while (array.length < 7);

    array.sort(function(a, b) {
        return a - b;
    });

    res.render('pages/game/cricket', {nbPlayer: req.query.nbPlayer, maxRound: 20, arrayTargets: array, mode: "cricket"});
});

router.get('/01', function(req, res) {
    res.render('pages/game/01', {nbPlayer: req.query.nbPlayer, mode: 501, maxRound: 15, arrayTargets: arrayComplete});
});
router.get('/game/501', function(req, res) {
    res.render('pages/game/01', {nbPlayer: req.query.nbPlayer, mode: 501, maxRound: 15, arrayTargets: arrayComplete});
});

router.get('/game/301', function(req, res) {
    res.render('pages/game/01', {nbPlayer: req.query.nbPlayer, mode: 301, maxRound: 10, arrayTargets: arrayComplete});
});

router.get('/game/701', function(req, res) {
    res.render('pages/game/01', {nbPlayer: req.query.nbPlayer, mode: 701, maxRound: 20, arrayTargets: arrayComplete});
});

router.get('/game/hyperjumpup', function(req, res) {
    res.render('pages/game/hyperjumpup', {nbPlayer: req.query.nbPlayer, maxRound: 12, arrayTargets: arrayComplete});
});

router.get('/game/goldHunting', function(req, res) {
    res.render('pages/game/goldHunting', {nbPlayer: req.query.nbPlayer, maxRound: 10, arrayTargets: arrayComplete});
});


function between(min, max) {
    return Math.floor(
        Math.random() * (max - min + 1) + min
    )
}


module.exports = router;

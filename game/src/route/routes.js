const express = require('express');
const bdd = require('..//bdd/bddPlayers');
const router = express.Router();

arrayComplete = ["20","19","18","17","16","15","14","13","12","11","10","9","8","7","6","5","4","3","2","1","25"]


router.get('/', function(req, res) {
    res.render('pages/index');
});
router.get('/settings', async function (req, res) {
    try {
        const arrayPlayers = await bdd.getPlayers(); // Attendez la résolution de la promesse
        res.render('pages/settings', {players: arrayPlayers});
    } catch (error) {
        console.error("Erreur lors de l'obtention des joueurs :", error);
    }
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

router.get('/selectionJoueur', async function(req, res) {
    let nbPlayer;
    if (req.query.game === "cricket" || req.query.game === "goldHunting") {
        nbPlayer = 4;
    } else {
        nbPlayer = 8;
    }
    
    try {
        const arrayPlayers = await bdd.getPlayers();
        res.render('pages/selectionJoueur', {
            game: req.query.game, 
            nbPlayerMax: nbPlayer,
            players: arrayPlayers || []
        });
    } catch (error) {
        console.error("Erreur lors de l'obtention des joueurs :", error);
        res.render('pages/selectionJoueur', {
            game: req.query.game, 
            nbPlayerMax: nbPlayer,
            players: []
        });
    }
});

// Fonction pour récupérer les noms des joueurs sélectionnés
async function getPlayerNames(req) {
    try {
        // Récupérer la liste des joueurs depuis la BDD
        const arrayPlayers = await bdd.getPlayers();
        
        // Préparer un tableau pour les noms des joueurs
        const playerNames = [];
        
        // Pour chaque joueur dans la partie
        for (let i = 1; i <= req.query.nbPlayer; i++) {
            const playerId = req.query['player' + i];
            
            // Si un joueur a été sélectionné dans la BDD
            if (playerId && playerId !== 'default') {
                // Trouver le joueur dans la liste
                const selectedPlayer = arrayPlayers.find(player => player.id.toString() === playerId);
                if (selectedPlayer) {
                    playerNames.push(selectedPlayer.name);
                } else {
                    playerNames.push('Joueur ' + i);
                }
            } else {
                // Joueur anonyme
                playerNames.push('Joueur ' + i);
            }
        }
        
        return playerNames;
    } catch (error) {
        console.error("Erreur lors du chargement des profils de joueurs :", error);
        
        // Fallback si erreur
        const playerNames = [];
        for (let i = 1; i <= req.query.nbPlayer; i++) {
            playerNames.push('Joueur ' + i);
        }
        
        return playerNames;
    }
}

router.get('/game/cricket', async function(req, res) {
    const playerNames = await getPlayerNames(req);
    
    res.render('pages/game/cricket', {
        nbPlayer: req.query.nbPlayer, 
        maxRound: 2, 
        arrayTargets: ["20", "19", "18", "17", "16", "15", "25"], 
        mode: "cricket",
        playerNames: playerNames
    });
});

router.get('/game/cricketshorty', async function(req, res) {
    const playerNames = await getPlayerNames(req);
    
    res.render('pages/game/cricket', {
        nbPlayer: req.query.nbPlayer, 
        maxRound: 10, 
        arrayTargets: ["20", "19", "18", "17", "16", "15", "25"], 
        mode: "cricket",
        playerNames: playerNames
    });
});

router.get('/game/cricketcutthroat', async function(req, res) {
    const playerNames = await getPlayerNames(req);
    
    res.render('pages/game/cricket', {
        nbPlayer: req.query.nbPlayer, 
        maxRound: 20, 
        arrayTargets: ["20", "19", "18", "17", "16", "15", "25"], 
        mode: "cricket",
        playerNames: playerNames
    });
});

router.get('/game/cricketrandom', async function(req, res) {
    let array = [25];
    do {
        let nb = between(1, 20);
        if (!array.includes(nb))
            array.push(nb);
    } while (array.length < 7);

    array.sort(function(a, b) {
        return a - b;
    });

    const playerNames = await getPlayerNames(req);
    
    res.render('pages/game/cricket', {
        nbPlayer: req.query.nbPlayer, 
        maxRound: 20, 
        arrayTargets: array, 
        mode: "cricket",
        playerNames: playerNames
    });
});

router.get('/game/cricketcutthroatrandom', async function(req, res) {
    let array = [25];
    do {
        let nb = between(1, 20);
        if (!array.includes(nb))
            array.push(nb);
    } while (array.length < 7);

    array.sort(function(a, b) {
        return a - b;
    });

    const playerNames = await getPlayerNames(req);
    
    res.render('pages/game/cricket', {
        nbPlayer: req.query.nbPlayer, 
        maxRound: 20, 
        arrayTargets: array, 
        mode: "cricket",
        playerNames: playerNames
    });
});

router.get('/01', async function(req, res) {
    const playerNames = await getPlayerNames(req);
    res.render('pages/game/01', {
        nbPlayer: req.query.nbPlayer, 
        mode: 501, 
        maxRound: 15, 
        arrayTargets: arrayComplete,
        playerNames: playerNames
    });
});

router.get('/game/501', async function(req, res) {
    const playerNames = await getPlayerNames(req);
    res.render('pages/game/01', {
        nbPlayer: req.query.nbPlayer, 
        mode: 501, 
        maxRound: 2, 
        arrayTargets: arrayComplete,
        playerNames: playerNames
    });
});

router.get('/game/301', async function(req, res) {
    const playerNames = await getPlayerNames(req);
    res.render('pages/game/01', {
        nbPlayer: req.query.nbPlayer, 
        mode: 301, 
        maxRound: 10, 
        arrayTargets: arrayComplete,
        playerNames: playerNames
    });
});

router.get('/game/701', async function(req, res) {
    const playerNames = await getPlayerNames(req);
    res.render('pages/game/01', {
        nbPlayer: req.query.nbPlayer, 
        mode: 701, 
        maxRound: 20, 
        arrayTargets: arrayComplete,
        playerNames: playerNames
    });
});

router.get('/game/hyperjumpup', async function(req, res) {
    const playerNames = await getPlayerNames(req);
    res.render('pages/game/hyperjumpup', {
        nbPlayer: req.query.nbPlayer, 
        maxRound: 2, 
        arrayTargets: arrayComplete,
        playerNames: playerNames
    });
});

router.get('/game/goldHunting', async function(req, res) {
    const playerNames = await getPlayerNames(req);
    res.render('pages/game/goldHunting', {
        nbPlayer: req.query.nbPlayer, 
        maxRound: 10, 
        arrayTargets: arrayComplete,
        playerNames: playerNames
    });
});


function between(min, max) {
    return Math.floor(
        Math.random() * (max - min + 1) + min
    )
}

module.exports = router;

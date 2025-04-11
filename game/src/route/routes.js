const express = require('express');
const bdd = require('..//bdd/bddPlayers');
const router = express.Router();

arrayComplete = ["20","19","18","17","16","15","14","13","12","11","10","9","8","7","6","5","4","3","2","1","25"]

// Thème par défaut à utiliser dans toutes les routes
const defaultTheme = 'marie';

router.get('/', async function(req, res) {
    try {
        // Récupérer les dernières parties pour les afficher dans la boîte des règles
        const games = await require('../bdd/bddGames').getGames();
        
        // Récupérer les 5 dernières parties
        const recentGames = games.slice(0, Math.min(5, games.length));
        
        // Formater les données des parties récentes pour l'affichage
        const formattedGames = recentGames.map(game => {
            // Parsing des données JSON stockées sous forme de chaîne
            let playerNames = [];
            
            try {
                playerNames = JSON.parse(game.players || '[]');
            } catch (e) {
                console.error("Erreur de parsing JSON:", e);
            }
            
            return {
                id: game.id,
                type: game.type,
                formattedDate: new Date(game.date).toLocaleDateString('fr-FR', { 
                    day: '2-digit', 
                    month: '2-digit'
                }),
                winner: game.winner,
                playerNames
            };
        });
        
        res.render('pages/index', { 
            theme: defaultTheme,
            recentGames: formattedGames
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des parties récentes:", error);
        res.render('pages/index', { 
            theme: defaultTheme,
            recentGames: []
        });
    }
});


router.get('/test', async function(req, res) {
    
    const playerNames = await getPlayerNames(req);
    res.render('pages/test', {
        nbPlayer: req.query.nbPlayer, 
        mode: 501, 
        maxRound: 2, 
        arrayTargets: arrayComplete,
        playerNames: playerNames.names,
        playerData: playerNames.data,
        theme: defaultTheme
    });
});

router.get('/settings', async function (req, res) {
    try {
        const arrayPlayers = await bdd.getPlayers(); // Attendez la résolution de la promesse
        res.render('pages/settings', {players: arrayPlayers, theme: defaultTheme});
    } catch (error) {
        console.error("Erreur lors de l'obtention des joueurs :", error);
    }
});

router.get('/lobby/01', function(req, res) {
    res.render('pages/lobby/01', { theme: defaultTheme });
});

router.get('/lobby/crickets', function(req, res) {
    res.render('pages/lobby/crickets', { theme: defaultTheme });
});

router.get('/lobby/fungames', function(req, res) {
    res.render('pages/lobby/fungames', { theme: defaultTheme });
});

router.get('/selectionJoueur', async function(req, res) {
    let nbPlayer;
    if (req.query.game === "cricket" || req.query.game === "cricketcutthroat"|| req.query.game === "cricketrandom" || req.query.game === "cricketcutthroatrandom"|| req.query.game === "cricketshorty" || req.query.game === "goldHunting") {
        nbPlayer = 4;
    } else {
        nbPlayer = 8;
    }
    
    try {
        const arrayPlayers = await bdd.getPlayers();
        res.render('pages/selectionJoueur', {
            game: req.query.game, 
            nbPlayerMax: nbPlayer,
            players: arrayPlayers || [],
            theme: defaultTheme
        });
    } catch (error) {
        console.error("Erreur lors de l'obtention des joueurs :", error);
        res.render('pages/selectionJoueur', {
            game: req.query.game, 
            nbPlayerMax: nbPlayer,
            players: [],
            theme: defaultTheme
        });
    }
});

// Fonction pour récupérer les noms des joueurs sélectionnés
async function getPlayerNames(req) {
    try {
        // Récupérer la liste des joueurs depuis la BDD
        const arrayPlayers = await bdd.getPlayers();
        
        // Préparer un tableau pour les noms des joueurs et un tableau pour les informations complètes
        const playerNames = [];
        const playerData = [];
        // Couleurs par défaut pour les joueurs sans profil
        const defaultColors = [
            { color: '#f44336', colorDarker: '#c62828', colorTransparent: 'rgba(198, 40, 40, 0.4)' }, // Rouge
            { color: '#fdd835', colorDarker: '#c7aa2b', colorTransparent: 'rgba(199, 170, 43, 0.4)' }, // Jaune
            { color: '#2fc536', colorDarker: '#1d8122', colorTransparent: 'rgba(29, 129, 34, 0.4)' }, // Vert
            { color: '#03a9f4', colorDarker: '#016795', colorTransparent: 'rgba(1, 103, 149, 0.4)' }, // Bleu
            { color: '#ff9800', colorDarker: '#c97801', colorTransparent: 'rgba(201, 120, 1, 0.4)' }, // Orange
            { color: '#9c27b0', colorDarker: '#9805b0', colorTransparent: 'rgba(152, 5, 176, 0.4)' }, // Violet
            { color: '#ff00bc', colorDarker: '#bb018a', colorTransparent: 'rgba(187, 1, 138, 0.4)' }, // Rose
            { color: '#00f3ff', colorDarker: '#02b1b9', colorTransparent: 'rgba(2, 177, 185, 0.4)' }  // Cyan
        ];
        
        // Pour garder trace des couleurs utilisées
        const usedDefaultColorIndices = [];
        
        // Pour chaque joueur dans la partie
        for (let i = 1; i <= req.query.nbPlayer; i++) {
            const playerId = req.query['player' + i];
            
            // Si un joueur a été sélectionné dans la BDD
            if (playerId && playerId !== 'default') {
                // Trouver le joueur dans la liste
                const selectedPlayer = arrayPlayers.find(player => player.id.toString() === playerId);
                if (selectedPlayer) {
                    playerNames.push(selectedPlayer.name);
                    // Ajouter les données complètes du joueur avec ses couleurs
                    playerData.push({
                        name: selectedPlayer.name,
                        color: selectedPlayer.color || defaultColors[0].color,
                        colorDarker: selectedPlayer.colorDarker || defaultColors[0].colorDarker,
                        colorTransparent: selectedPlayer.colorTransparent || defaultColors[0].colorTransparent
                    });
                } else {
                    // Si joueur non trouvé, utiliser une couleur par défaut non utilisée
                    let colorIndex = 0;
                    while (usedDefaultColorIndices.includes(colorIndex)) {
                        colorIndex = (colorIndex + 1) % defaultColors.length;
                    }
                    usedDefaultColorIndices.push(colorIndex);
                    
                    playerNames.push('Joueur ' + i);
                    playerData.push({
                        name: 'Joueur ' + i,
                        ...defaultColors[colorIndex]
                    });
                }
            } else {
                // Joueur anonyme, utiliser une couleur par défaut non utilisée
                let colorIndex = 0;
                while (usedDefaultColorIndices.includes(colorIndex)) {
                    colorIndex = (colorIndex + 1) % defaultColors.length;
                }
                usedDefaultColorIndices.push(colorIndex);
                
                playerNames.push('Joueur ' + i);
                playerData.push({
                    name: 'Joueur ' + i,
                    ...defaultColors[colorIndex]
                });
            }
        }
        
        return { names: playerNames, data: playerData };
    } catch (error) {
        console.error("Erreur lors du chargement des profils de joueurs :", error);
        
        // Fallback si erreur - on crée des joueurs par défaut avec des couleurs prédéfinies
        const playerNames = [];
        const playerData = [];
        const defaultColors = [
            { color: '#f44336', colorDarker: '#c62828', colorTransparent: 'rgba(198, 40, 40, 0.4)' },
            { color: '#fdd835', colorDarker: '#c7aa2b', colorTransparent: 'rgba(199, 170, 43, 0.4)' },
            { color: '#2fc536', colorDarker: '#1d8122', colorTransparent: 'rgba(29, 129, 34, 0.4)' },
            { color: '#03a9f4', colorDarker: '#016795', colorTransparent: 'rgba(1, 103, 149, 0.4)' },
            { color: '#ff9800', colorDarker: '#c97801', colorTransparent: 'rgba(201, 120, 1, 0.4)' },
            { color: '#9c27b0', colorDarker: '#9805b0', colorTransparent: 'rgba(152, 5, 176, 0.4)' },
            { color: '#ff00bc', colorDarker: '#bb018a', colorTransparent: 'rgba(187, 1, 138, 0.4)' },
            { color: '#00f3ff', colorDarker: '#02b1b9', colorTransparent: 'rgba(2, 177, 185, 0.4)' }
        ];
        
        for (let i = 1; i <= req.query.nbPlayer; i++) {
            playerNames.push('Joueur ' + i);
            playerData.push({
                name: 'Joueur ' + i,
                ...defaultColors[(i - 1) % defaultColors.length]
            });
        }
        
        return { names: playerNames, data: playerData };
    }
}

router.get('/game/cricket', async function(req, res) {
    const playerNames = await getPlayerNames(req);
    
    res.render('pages/game/cricket', {
        nbPlayer: req.query.nbPlayer, 
        maxRound: 20,
        arrayTargets: ["20", "19", "18", "17", "16", "15", "25"], 
        mode: "cricket",
        playerNames: playerNames.names,
        playerData: playerNames.data,
        theme: defaultTheme
    });
});

router.get('/game/cricketshorty', async function(req, res) {
    const playerNames = await getPlayerNames(req);
    
    res.render('pages/game/cricket', {
        nbPlayer: req.query.nbPlayer, 
        maxRound: 10, 
        arrayTargets: ["20", "19", "18", "17", "16", "15", "25"], 
        mode: "cricket",
        playerNames: playerNames.names,
        playerData: playerNames.data,
        theme: defaultTheme
    });
});

router.get('/game/cricketcutthroat', async function(req, res) {
    const playerNames = await getPlayerNames(req);
    
    res.render('pages/game/cricketcutthroat', {
        nbPlayer: req.query.nbPlayer, 
        maxRound: 20, 
        arrayTargets: ["20", "19", "18", "17", "16", "15", "25"], 
        mode: "cricket",
        playerNames: playerNames.names,
        playerData: playerNames.data,
        theme: defaultTheme
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
        playerNames: playerNames.names,
        playerData: playerNames.data,
        theme: defaultTheme
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
    
    res.render('pages/game/cricketcutthroat', {
        nbPlayer: req.query.nbPlayer, 
        maxRound: 20, 
        arrayTargets: array, 
        mode: "cricket",
        playerNames: playerNames.names,
        playerData: playerNames.data,
        theme: defaultTheme
    });
});

router.get('/01', async function(req, res) {
    const playerNames = await getPlayerNames(req);
    res.render('pages/game/01', {
        nbPlayer: req.query.nbPlayer, 
        mode: 501, 
        maxRound: 15, 
        arrayTargets: arrayComplete,
        playerNames: playerNames.names,
        playerData: playerNames.data,
        theme: defaultTheme
    });
});

router.get('/game/501', async function(req, res) {
    const playerNames = await getPlayerNames(req);
    res.render('pages/game/01', {
        nbPlayer: req.query.nbPlayer, 
        mode: 501, 
        maxRound: 15,
        arrayTargets: arrayComplete,
        playerNames: playerNames.names,
        playerData: playerNames.data,
        theme: defaultTheme
    });
});

router.get('/game/301', async function(req, res) {
    const playerNames = await getPlayerNames(req);
    res.render('pages/game/01', {
        nbPlayer: req.query.nbPlayer, 
        mode: 301, 
        maxRound: 15,
        arrayTargets: arrayComplete,
        playerNames: playerNames.names,
        playerData: playerNames.data,
        theme: defaultTheme
    });
});

router.get('/game/701', async function(req, res) {
    const playerNames = await getPlayerNames(req);
    res.render('pages/game/01', {
        nbPlayer: req.query.nbPlayer, 
        mode: 701, 
        maxRound: 15,
        arrayTargets: arrayComplete,
        playerNames: playerNames.names,
        playerData: playerNames.data,
        theme: defaultTheme
    });
});

router.get('/game/hyperjumpup', async function(req, res) {
    const { names: playerNames, data: playerData } = await getPlayerNames(req);
    
    res.render('pages/game/hyperjumpup', {
        nbPlayer: req.query.nbPlayer, 
        maxRound: 12,
        arrayTargets: arrayComplete,
        playerNames,
        playerData,
        theme: defaultTheme
    });
});

router.get('/game/goldHunting', async function(req, res) {
    const { names: playerNames, data: playerData } = await getPlayerNames(req);
    
    res.render('pages/game/goldHunting', {
        nbPlayer: req.query.nbPlayer, 
        maxRound: 12, 
        arrayTargets: arrayComplete,
        playerNames,
        playerData,
        theme: defaultTheme
    });
});

router.get('/game/lejeudelato', async function(req, res) {
    const { names: playerNames, data: playerData } = await getPlayerNames(req);
    
    res.render('pages/game/lejeudelato', {
        nbPlayer: req.query.nbPlayer, 
        maxRound: 12, 
        arrayTargets: arrayComplete,
        playerNames,
        playerData,
        theme: defaultTheme
    });
});

router.get('/game/clockgame', async function(req, res) {
    const { names: playerNames, data: playerData } = await getPlayerNames(req);
    
    res.render('pages/game/clockgame', {
        nbPlayer: req.query.nbPlayer, 
        maxRound: 20, 
        arrayTargets: arrayComplete,
        playerNames,
        playerData,
        theme: defaultTheme
    });
});

router.get('/statistics', async function(req, res) {
    try {
        // Récupérer les données des joueurs et des parties
        const players = await bdd.getPlayers();
        const games = await require('../bdd/bddGames').getGames();
        
        // Calculer des statistiques globales
        const totalGames = games.length;
        const recentGames = games.slice(0, Math.min(10, games.length)); // 10 dernières parties
        
        // Trier les joueurs par nombre de parties
        const sortedPlayers = [...players].sort((a, b) => {
            return (parseInt(b.nbgames) || 0) - (parseInt(a.nbgames) || 0);
        });
        
        // Calculer des statistiques supplémentaires pour chaque joueur
        const enrichedPlayers = sortedPlayers.map(player => {
            // Précision (rapport entre hits et lancers)
            const nbHit = parseInt(player.nbhit) || 0;
            const nbThrow = parseInt(player.nbthrow) || 0;
            const accuracy = nbThrow > 0 ? Math.round((nbHit / nbThrow) * 100) : 0;
            
            // Taux de spéciaux (triples, doubles, bulls)
            const nbSpecials = (parseInt(player.nbtriple) || 0) + 
                            (parseInt(player.nbdouble) || 0) + 
                            (parseInt(player.nbbull) || 0);
            const specialsRate = nbThrow > 0 ? Math.round((nbSpecials / nbThrow) * 100) : 0;
            
            // Victoires (compter le nombre de parties où ce joueur est le gagnant)
            const wins = games.filter(game => game.winner === player.name).length;
            const winRate = parseInt(player.nbgames) > 0 ? Math.round((wins / parseInt(player.nbgames)) * 100) : 0;
            
            return {
                ...player,
                accuracy,
                specialsRate,
                wins,
                winRate
            };
        });
        
        // Formater les données des parties récentes pour l'affichage
        const formattedGames = recentGames.map(game => {
            // Parsing des données JSON stockées sous forme de chaîne
            let playerNames = [];
            let gameStats = {};
            
            try {
                playerNames = JSON.parse(game.players || '[]');
                gameStats = JSON.parse(game.stats || '{}');
            } catch (e) {
                console.error("Erreur de parsing JSON:", e);
            }
            
            return {
                ...game,
                formattedDate: new Date(game.date).toLocaleDateString('fr-FR', { 
                    day: '2-digit', 
                    month: '2-digit', 
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                }),
                playerNames,
                gameStats
            };
        });
        
        // Rendre la page avec les données
        res.render('pages/statistics', {
            players: enrichedPlayers,
            totalGames,
            games: formattedGames,
            theme: defaultTheme
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des statistiques:", error);
        res.render('pages/statistics', {
            players: [],
            totalGames: 0,
            games: [],
            error: "Impossible de récupérer les statistiques",
            theme: defaultTheme
        });
    }
});

function between(min, max) {
    return Math.floor(
        Math.random() * (max - min + 1) + min
    )
}

module.exports = router;

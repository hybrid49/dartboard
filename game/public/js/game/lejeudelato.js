// Règles du Jeu de l'ATO:
// - Tour 1: Viser le 12
// - Tour 2: Viser le 13
// - Tour 3: Viser le 14
// - Tour 4: Viser tous les doubles
// - Tour 5: Viser le 15
// - Tour 6: Viser le 16
// - Tour 7: Viser le 17
// - Tour 8: Viser tous les triples
// - Tour 9: Viser le 18
// - Tour 10: Viser le 19
// - Tour 11: Viser le 20
// - Tour 12: Viser le bull (25/50)
// Si aucune des 3 fléchettes ne touche la cible, le score est divisé par 2.

// Définition des cibles pour chaque tour
const TARGETS_BY_ROUND = {
    1: { type: 'number', value: 12, display: '12', displayType: 'SIMPLE' },
    2: { type: 'number', value: 13, display: '13', displayType: 'SIMPLE' },
    3: { type: 'number', value: 14, display: '14', displayType: 'SIMPLE' },
    4: { type: 'doubleAny', value: 'D', display: 'DOUBLES', displayType: 'DOUBLE' },
    5: { type: 'number', value: 15, display: '15', displayType: 'SIMPLE' },
    6: { type: 'number', value: 16, display: '16', displayType: 'SIMPLE' },
    7: { type: 'number', value: 17, display: '17', displayType: 'SIMPLE' },
    8: { type: 'tripleAny', value: 'T', display: 'TRIPLES', displayType: 'TRIPLE' },
    9: { type: 'number', value: 18, display: '18', displayType: 'SIMPLE' },
    10: { type: 'number', value: 19, display: '19', displayType: 'SIMPLE' },
    11: { type: 'number', value: 20, display: '20', displayType: 'SIMPLE' },
    12: { type: 'bull', value: 25, display: 'BULL', displayType: 'CENTRE' }
};

// Variables du jeu
let currentRound = 1;
let dartThrown = 0;
let dartsHitTarget = 0;
let roundChanged = false;

// Initialisation des données pour chaque joueur
function initAtoGame() {
    for (let i = 1; i <= nombrePlayer; i++) {
        arrayTouch[i] = {
            'point': 0,
            'currentRound': 1,
            'dartsThrownTotal': 0,
            'dartsHitTotal': 0,
            'roundStats': {}
        };
    }
    
    // Initialiser les statistiques de chaque round pour chaque joueur
    for (let i = 1; i <= nombrePlayer; i++) {
        for (let round = 1; round <= 12; round++) {
            arrayTouch[i]['roundStats'][round] = {
                'dartsThrown': 0,
                'dartsHit': 0,
                'pointsScored': 0,
                'scoreDivided': false
            };
        }
    }
    
    updateBoard();
    updateTargetDisplay();
}

// Fonction principale pour gérer les lancers
function manageThrow(dart, number, zone) {
    // Enregistrer le lancer
    dartThrown++;
    $('#dartsThrown').text(dartThrown);
    
    // Vérifier si le lancer touche la cible actuelle
    let hit = isTargetHit(dart, number, zone);
    
    if (hit) {
        dartsHitTarget++;
        
        // Calcul des points selon le type de lancer
        let points = 0;
        if (zone === 'S') points = parseInt(number);
        else if (zone === 'D') points = parseInt(number) * 2;
        else if (zone === 'T') points = parseInt(number) * 3;
        else if (dart === 'S25') points = 25;
        else if (dart === 'D25') points = 50;
        
        // Ajouter les points au score du joueur
        arrayTouch[selectedPlayer]['point'] += points;
        
        // Mettre à jour les statistiques du round actuel
        let playerRound = arrayTouch[selectedPlayer]['currentRound'];
        arrayTouch[selectedPlayer]['roundStats'][playerRound]['dartsHit']++;
        arrayTouch[selectedPlayer]['roundStats'][playerRound]['pointsScored'] += points;
        arrayTouch[selectedPlayer]['dartsHitTotal']++;
        
        // Mettre à jour le tableau
        highlightTarget(true);
    } else {
        // Le lancer n'a pas touché la cible
        highlightTarget(false);
    }
    
    // Mettre à jour les statistiques du round actuel
    let playerRound = arrayTouch[selectedPlayer]['currentRound'];
    arrayTouch[selectedPlayer]['roundStats'][playerRound]['dartsThrown']++;
    arrayTouch[selectedPlayer]['dartsThrownTotal']++;
    
    // Si 3 fléchettes ont été lancées, vérifier si le tour est terminé
    if (dartThrown === 3) {
        // Si aucune fléchette n'a touché la cible, diviser le score par 2
        if (dartsHitTarget === 0) {
            divideScore();
            arrayTouch[selectedPlayer]['roundStats'][playerRound]['scoreDivided'] = true;
        }
        
        // Préparer pour le changement de joueur
        displayModalChangePlayer();
    }
    
    // Mettre à jour l'affichage
    displayScore();
}

// Vérifier si le lancer touche la cible actuelle
function isTargetHit(dart, number, zone) {
    const playerRound = arrayTouch[selectedPlayer]['currentRound'];
    const target = TARGETS_BY_ROUND[playerRound];
    
    switch (target.type) {
        case 'number':
            // La cible est un nombre spécifique (ex: 12, 13, 14, etc.)
            return parseInt(number) === target.value;
            
        case 'doubleAny':
            // La cible est n'importe quel double
            return zone === 'D';
            
        case 'tripleAny':
            // La cible est n'importe quel triple
            return zone === 'T';
            
        case 'bull':
            // La cible est le bull (simple ou double)
            return dart === 'S25' || dart === 'D25';
            
        default:
            return false;
    }
}

// Diviser le score par 2 avec animation
function divideScore() {
    // Obtenir le score actuel
    const score = arrayTouch[selectedPlayer]['point'];
    const newScore = Math.floor(score / 2);
    
    // Animer la division du score
    $(`#scoreTotal${selectedPlayer}`).addClass('score-divided');
    
    // Après l'animation, mettre à jour le score
    setTimeout(() => {
        arrayTouch[selectedPlayer]['point'] = newScore;
        displayScore();
        $(`#scoreTotal${selectedPlayer}`).removeClass('score-divided');
    }, 1000);
}

// Mettre à jour l'affichage de la cible actuelle
function updateTargetDisplay() {
    const playerRound = arrayTouch[selectedPlayer]['currentRound'];
    const target = TARGETS_BY_ROUND[playerRound];
    
    // Mettre à jour le texte de la cible
    $('.currentTarget').text(target.display);
    $('.target-type').text(target.displayType);
    
    // Mettre à jour le numéro du tour
    $('#nbRound').text(playerRound);
    
    // Mettre à jour le texte d'information
    let infoText = '';
    if (target.type === 'number') {
        infoText = `Chaque fléchette qui touche le ${target.value} marque des points`;
    } else if (target.type === 'doubleAny') {
        infoText = 'Chaque fléchette qui touche un double marque des points';
    } else if (target.type === 'tripleAny') {
        infoText = 'Chaque fléchette qui touche un triple marque des points';
    } else if (target.type === 'bull') {
        infoText = 'Chaque fléchette qui touche le centre marque des points';
    }
    $('.target-info').text(infoText);
    
    // Calculer la progression du jeu
    const progressPercentage = Math.floor((playerRound - 1) / 12 * 100);
    $('.progress-bar').css('width', `${progressPercentage}%`).text(`${progressPercentage}%`);
}

// Mettre en évidence la cible sur le tableau
function updateBoard() {
    // Réinitialiser toutes les zones
    $(".board > div").removeClass("selected");
    
    // Mettre en évidence la cible actuelle
    const playerRound = arrayTouch[selectedPlayer]['currentRound'];
    const target = TARGETS_BY_ROUND[playerRound];
    
    if (target.type === 'number') {
        // Mettre en évidence un numéro spécifique
        $(`#zone${target.value}`).addClass("selected");
    } else if (target.type === 'doubleAny' || target.type === 'tripleAny') {
        // Pour les doubles et triples, nous ne mettons rien en évidence car ils s'appliquent à tous les numéros
        // On pourrait potentiellement ajouter un effet visuel différent ici pour indiquer tous les doubles/triples
    } else if (target.type === 'bull') {
        // Pour le bull, nous n'avons pas d'élément spécifique à mettre en évidence
        // On pourrait potentiellement ajouter un effet visuel au centre du tableau
    }
}

// Mettre en évidence temporairement la cible lors d'un lancer
function highlightTarget(hit) {
    const playerRound = arrayTouch[selectedPlayer]['currentRound'];
    const target = TARGETS_BY_ROUND[playerRound];
    
    if (target.type === 'number') {
        // Flash d'effet pour un lancer réussi/raté
        if (hit) {
            $(`#zone${target.value}`).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
        }
    }
}

// Fonction appelée lorsque le joueur change
function exitEndChangePlayer() {
    // Réinitialiser les compteurs de fléchettes pour le nouveau joueur
    dartThrown = 0;
    dartsHitTarget = 0;
    $('#dartsThrown').text(dartThrown);
    
    // Mettre à jour l'affichage pour le nouveau joueur
    updateBoard();
    updateTargetDisplay();
    
    // Si le tour a changé, mettre à jour l'affichage
    if (roundChanged) {
        roundChanged = false;
    }
}

// Fonction pour passer au tour suivant (appelée après le dernier joueur)
function nextRound() {
    currentRound++;
    
    // Mettre à jour le tour pour tous les joueurs
    for (let i = 1; i <= nombrePlayer; i++) {
        if (arrayTouch[i]['currentRound'] < 12) {
            arrayTouch[i]['currentRound']++;
        }
    }
    
    roundChanged = true;
    
    // Vérifier si le jeu est terminé
    if (currentRound > 12) {
        displayVictoryScreen();
        return;
    }
    
    updateBoard();
    updateTargetDisplay();
}

// Afficher le score de chaque joueur
function displayScore() {
    for (let i = 1; i <= nombrePlayer; i++) {
        $('#scoreTotal' + i).html(arrayTouch[i]['point']);
    }
}

// Déterminer le gagnant et afficher l'écran de victoire
function displayVictoryScreen() {
    let maxScore = -1;
    let winner = 1;
    
    // Trouver le joueur avec le score le plus élevé
    for (let i = 1; i <= nombrePlayer; i++) {
        if (arrayTouch[i]['point'] > maxScore) {
            maxScore = arrayTouch[i]['point'];
            winner = i;
        }
    }
    
    // Sauvegarder les statistiques
    const customStats = {};
    for (let i = 1; i <= nombrePlayer; i++) {
        customStats[i] = {
            finalScore: arrayTouch[i]['point'],
            dartsHit: arrayTouch[i]['dartsHitTotal'],
            dartsThrown: arrayTouch[i]['dartsThrownTotal'],
            roundsCompleted: arrayTouch[i]['currentRound']
        };
    }
    
    // Sauvegarder les statistiques du jeu
    saveGameStats(winner, "JeuDeLATO", customStats);
    
    // Afficher l'écran de victoire
    $("#changePlayer").fadeOut();
    $("#newGame").fadeIn();
    $("#returnMenu").fadeIn();
    $("#zonevictory").fadeIn();
    $("#zonevictoryPlayer").html($('.zoneScorePlayer' + winner + ' .titlePlayer').text() || 'Joueur ' + winner);
    $("#zonebtnno").fadeIn();
    $("#zonebtyes").fadeIn();
}

// Vérifier si la victoire est atteinte
function checkVictory() {
    // La victoire n'est atteinte qu'à la fin du 12ème tour
    return currentRound > 12;
}

// Initialiser le jeu
initAtoGame(); 
// Règles du Tour d'Horloge (Around the Clock) :
// 1. Chaque joueur commence à 1 et doit atteindre les numéros dans l'ordre croissant (1, 2, 3, etc.)
// 2. Un joueur ne peut passer au numéro suivant que lorsqu'il a touché le numéro actuel
// 3. Le premier joueur à atteindre 20 remporte la partie
// 4. Variantes possibles : 
//    - Standard : tous les segments (simples, doubles, triples) sont valides
//    - Double : seuls les segments doubles sont valides
//    - Triple : seuls les segments triples sont valides
//    - Bull : après le 20, il faut toucher le centre simple puis le double centre

let arrayClockNumbers = [];  // Numéros que chaque joueur doit atteindre
let clockMode = "standard";  // Mode par défaut (standard, double, triple, bull)
let maxNumber = 20;          // Nombre maximum à atteindre (20 par défaut, 21 pour le bull)

initClockGame();

function initClockGame() {
    // Initialisation des données pour chaque joueur
    for (let i = 1; i <= nombrePlayer; i++) {
        if (!arrayTouch[i]) {
            arrayTouch[i] = {};
        }
        arrayTouch[i]['currentNumber'] = 1;  // Tous les joueurs commencent au numéro 1
        arrayTouch[i]['completedNumbers'] = [];  // Numéros déjà complétés
        arrayTouch[i]['point'] = 0;  // Score initial à 0
    }

    // Si le mode Bull est sélectionné, ajouter 25 (simple bull) et 50 (double bull) aux cibles
    if (clockMode === "bull") {
        maxNumber = 22;  // 20 + bull (21) + double bull (22)
    } else {
        maxNumber = 20;
    }

    // Mettre à jour l'affichage
    updateBoardHighlight();
}

function manageThrow(dart, number, zone) {
    // Récupération du numéro que le joueur actuel doit toucher
    let currentNumber = arrayTouch[selectedPlayer]['currentNumber'];
    let isValid = false;

    // Validation du tir selon le mode de jeu
    if (currentNumber <= 20) {
        // Vérifie si le numéro touché correspond au numéro attendu
        if (parseInt(number) === currentNumber) {
            // Vérification du type de zone selon le mode de jeu
            switch (clockMode) {
                case "standard":
                    isValid = true;  // Toutes les zones sont valides
                    break;
                case "double":
                    isValid = (zone === "D");  // Seulement les doubles
                    break;
                case "triple":
                    isValid = (zone === "T");  // Seulement les triples
                    break;
                case "bull":
                    isValid = true;  // Comme standard pour les nombres 1-20
                    break;
            }
        }
    } else if (clockMode === "bull" && currentNumber === 21) {
        // Pour le mode Bull, après 20, le joueur doit toucher le bull simple (S25)
        isValid = (dart === "S25");
    } else if (clockMode === "bull" && currentNumber === 22) {
        // Pour le mode Bull, après le bull simple, le joueur doit toucher le double bull (D25)
        isValid = (dart === "D25");
    }

    // Si le tir est valide, passer au numéro suivant
    if (isValid) {
        // Ajouter le numéro actuel à la liste des numéros complétés
        arrayTouch[selectedPlayer]['completedNumbers'].push(currentNumber);
        
        // Augmenter le score (nombre de numéros complétés)
        arrayTouch[selectedPlayer]['point'] = arrayTouch[selectedPlayer]['completedNumbers'].length;
        
        // Passer au prochain numéro
        arrayTouch[selectedPlayer]['currentNumber']++;
        
        // Mettre à jour la visualisation du tableau de jeu
        updateBoardHighlight();
    }
}

function updateBoardHighlight() {
    // Réinitialiser toutes les sections
    $(".board > div").removeClass("selected").removeClass("completed");
    
    // Marquer les numéros complétés en vert pour le joueur actuel
    if (arrayTouch[selectedPlayer]['completedNumbers']) {
        arrayTouch[selectedPlayer]['completedNumbers'].forEach(number => {
            if (number <= 20) {
                $(`#zone${number}`).addClass("completed");
            }
        });
    }
    
    // Mettre en évidence le numéro actuel à viser pour le joueur actuel
    let currentNumber = arrayTouch[selectedPlayer]['currentNumber'];
    if (currentNumber <= 20) {
        // Appliquer l'effet de clignotement au numéro à viser
        $(`#zone${currentNumber}`).addClass("selected");
        
        // Faire brièvement clignoter le numéro pour attirer l'attention lors du changement
        $(`#zone${currentNumber}`).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
    }
    
    // Mettre à jour l'affichage du numéro actuel et de la progression
    updateProgressDisplay();
}

// Cette fonction est appelée lors du changement de joueur pour mettre à jour l'affichage
function exitEndChangePlayer() {
    // Mettre à jour l'affichage de la cible pour le nouveau joueur actif
    updateBoardHighlight();
}

function updateProgressDisplay() {
    // Afficher le numéro actuel du joueur actif
    let currentNumber = arrayTouch[selectedPlayer]['currentNumber'];
    let displayNumber = currentNumber;
    
    // Affichage spécial pour les bulls dans le mode bull
    if (clockMode === "bull" && currentNumber === 21) {
        displayNumber = "BULL";
    } else if (clockMode === "bull" && currentNumber === 22) {
        displayNumber = "D-BULL";
    }
    
    // Mettre à jour le texte du numéro actuel
    $(".currentNumber").text(displayNumber);
    
    // Mettre à jour la barre de progression
    let completedCount = arrayTouch[selectedPlayer]['completedNumbers'] ? arrayTouch[selectedPlayer]['completedNumbers'].length : 0;
    let progressPercentage = (completedCount / maxNumber) * 100;
    $(".progress-bar").css("width", progressPercentage + "%").text(Math.floor(progressPercentage) + "%");
    
    // Mettre à jour la liste des numéros restants
    updateRemainingNumbers();
}

function updateRemainingNumbers() {
    let currentNumber = arrayTouch[selectedPlayer]['currentNumber'];
    let remainingHtml = "Numéros restants : ";
    let remainingCount = 0;
    
    // Générer la liste des 5 prochains numéros à viser
    for (let i = currentNumber; i <= Math.min(currentNumber + 4, maxNumber); i++) {
        let displayNumber = i;
        if (clockMode === "bull" && i === 21) {
            displayNumber = "BULL";
        } else if (clockMode === "bull" && i === 22) {
            displayNumber = "D-BULL";
        }
        
        remainingHtml += `<span>${displayNumber}</span> `;
        remainingCount++;
    }
    
    // S'il n'y a plus de numéros restants, indiquer victoire imminente
    if (remainingCount === 0) {
        remainingHtml = "<span class='victory-near'>Victoire imminente !</span>";
    }
    
    // Mettre à jour le texte
    $(".remaining-numbers").html(remainingHtml);
}

function checkVictory() {
    // Vérifier si le joueur actuel a atteint le dernier numéro
    return arrayTouch[selectedPlayer]['currentNumber'] > maxNumber;
}

function setClockMode(mode) {
    // Changer le mode de jeu
    clockMode = mode;
    
    // Réinitialiser le jeu avec le nouveau mode
    resetGame();
    
    // Mettre à jour l'interface utilisateur
    $(".variation-btn").removeClass("active");
    $(`.variation-btn[data-mode="${mode}"]`).addClass("active");
}

function resetGame() {
    // Réinitialiser les variables du jeu
    initClockGame();
    
    // Réinitialiser l'affichage
    updateBoardHighlight();
}

function displayScore() {
    // Afficher le score (nombre de numéros complétés) pour chaque joueur
    for (let i = 1; i <= nombrePlayer; i++) {
        let progress = (arrayTouch[i] && arrayTouch[i]['completedNumbers']) ? arrayTouch[i]['completedNumbers'].length : 0;
        let maxValue = maxNumber;
        $('#scoreTotal' + i).html(progress + "/" + maxValue);
    }
}

function displayVictoryScreen() {
    // Déterminer le gagnant
    let winner = determineWinner();
    
    // Préparer les statistiques spécifiques au mode de jeu
    let customStats = {};
    for (let i = 1; i <= nombrePlayer; i++) {
        customStats[i] = {
            mode: clockMode,
            completedNumbers: (arrayTouch[i] && arrayTouch[i]['completedNumbers']) ? arrayTouch[i]['completedNumbers'].length : 0,
            totalThrows: (arrayTouch[i]) ? (
                arrayTouch[i]['nbSingle'] + arrayTouch[i]['nbDouble'] + arrayTouch[i]['nbTriple'] + 
                arrayTouch[i]['nbBull'] + arrayTouch[i]['nbDoubleBull'] + arrayTouch[i]['nbMiss']
            ) : 0
        };
    }
    
    // Sauvegarder les statistiques
    saveGameStats(winner, "TourHorloge", customStats);
    
    // Afficher l'écran de victoire
    $("#changePlayer").fadeOut();
    $("#newGame").fadeIn();
    $("#returnMenu").fadeIn();
    $("#zonevictory").fadeIn();
    $("#zonevictoryPlayer").html($('.zoneScorePlayer' + winner + ' .titlePlayer').text() || 'Joueur ' + winner);
    $("#zonebtnno").fadeIn();
    $("#zonebtyes").fadeIn();
}

function determineWinner() {
    // Le gagnant est le joueur avec le plus de numéros complétés
    let maxProgress = 0;
    let winner = 1;
    
    for (let i = 1; i <= nombrePlayer; i++) {
        if (!arrayTouch[i] || !arrayTouch[i]['completedNumbers']) continue;
        
        let progress = arrayTouch[i]['completedNumbers'].length;
        if (progress > maxProgress) {
            maxProgress = progress;
            winner = i;
        } else if (progress === maxProgress) {
            // En cas d'égalité, le joueur avec le moins de lancers gagne
            let player1Throws = arrayTouch[i]['nbSingle'] + arrayTouch[i]['nbDouble'] + arrayTouch[i]['nbTriple'] + 
                              arrayTouch[i]['nbBull'] + arrayTouch[i]['nbDoubleBull'] + arrayTouch[i]['nbMiss'];
            let player2Throws = arrayTouch[winner]['nbSingle'] + arrayTouch[winner]['nbDouble'] + arrayTouch[winner]['nbTriple'] + 
                              arrayTouch[winner]['nbBull'] + arrayTouch[winner]['nbDoubleBull'] + arrayTouch[winner]['nbMiss'];
            
            if (player1Throws < player2Throws) {
                winner = i;
            }
        }
    }
    
    return winner;
} 
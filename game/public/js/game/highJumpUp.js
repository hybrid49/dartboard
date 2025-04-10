// Rules of Play:
// Même principe que Jump Up sauf qu'on commence avec 5 zones et que le multiplicateur augmente de la
//    même façon que le nombre de zone
//    (un triple d'une zone à toucher : 3 nouvelles zones & +3 de multiplicateur)
// Lorsque la bulle fait partie des zones à toucher, elle y reste et elle ne vaut pas 50 points mais
//    le double du score actuel du joueur
// Si le joueur touche avec ses 3 flechettes des zones à amélioration de multiplicateur, il gagne
//    un combo pour son dernier lancé qui fait multiplier par 3 le score de ce lancer
//(ex : un joueur à 2455 points et touché 2 fois des zones cibles, et il touche la bulle sur
//      la 3ème qui fait aussi partie des zones cibles, dans ce cas il gagne 2455*3 pour ce lancer
//      il passe donc à 9820 points)
// De plus une ancienne zone a ciblée marque les points habituels
let arrayMultiplier = [];
let arrayHitted = [];

initHighJumpUp( );

function initHighJumpUp(){
    arrayTouch.forEach((item, index) => {
        arrayTouch[index]['multiplier'] = 1;
        // Round data
        arrayTouch[index]['nbMultiplierHittedRound'] = 0;
        // End game data
        arrayTouch[index]['combo'] = 0;
    });

    for(let i = 1; i <= nombrePlayer; i++){
        arrayMultiplier[i] = [1,2,3,4,5];
        arrayHitted[i] = [];
    }

    displayTargetZone();
}

function displayTargetZone(){
    $('.borderRound').hide();
    arrayTargets.forEach((item, index) => {
        if (arrayMultiplier[selectedPlayer].includes(parseInt(item))
        && !arrayHitted[selectedPlayer].includes(parseInt(item)))
        {
            if(parseInt(item) === 25)
                $('.borderRound').show();

            $('#zone'+item).addClass('selected');
        }
        else
            $('#zone'+item).removeClass('selected');


    });
}

function manageThrow(dart, number, zone){
    let numberTouch = determineNumberTouchs(zone);
    let multiplier  = 1;
    let point  = number;

    if ((arrayMultiplier[selectedPlayer].includes(number))
    && !(arrayHitted[selectedPlayer].includes(number))){
        if (number === 25) {
            numberTouch = 1;
            point = arrayTouch[selectedPlayer]['point'];
        }
        multiplier = manageHittedMultiplier(number, numberTouch);
    }else if (number === 25)
        numberTouch = 2;

    let total = multiplier * numberTouch * point;

    arrayTouch[selectedPlayer]['point'] += total;
    displayRound();
}

function manageHittedMultiplier(number, numberTouch){
    let currentMultiplier = (number === 25) ? 1 : arrayTouch[selectedPlayer]['multiplier'];

    let combo = calculateNewMultiplier(numberTouch);
    determineNewMultiplierZone(numberTouch);
    determineHittedMultiplierZone(number);

    return currentMultiplier * combo;
}


function calculateNewMultiplier(numberTouch){
    arrayTouch[selectedPlayer]['multiplier'] += numberTouch;
    arrayTouch[selectedPlayer]['nbMultiplierHittedRound']++;

    //Combo is triggered when player touch 3 times multiplier Area during a round
    return (arrayTouch[selectedPlayer]['nbMultiplierHittedRound'] === 3) ? 3 : 1;
}

function determineNewMultiplierZone(numberTouch){
    let number = arrayMultiplier[selectedPlayer].slice(-1);

    if (number !== 25){
        for (let i = 0; i < numberTouch && number < 21; i++) {
            number++;

            if (number === 21)
                number = 25;
            arrayMultiplier[selectedPlayer].push(number);
        }
    }
}

function determineHittedMultiplierZone(number){
    if (number !== 25)
        arrayHitted[selectedPlayer].push(number);
}

function checkVictory(button){
    if(button === true)
        return (round === maxRound && selectedPlayer === nombrePlayer)
    else
        return  (round === maxRound && selectedPlayer === nombrePlayer && nbThrow === 3)
}

function displayScore(){
    displayTargetZone();
    $('#scoreTotal'+selectedPlayer).html(arrayTouch[selectedPlayer]['point']);
    $('.textMultiple').html('X '+arrayTouch[selectedPlayer]['multiplier']);
}

function displayVictoryScreen(){
    let winner = determineWinner();
     // Préparation des stats spécifiques au mode JumpUp
     let customStats = {};
     for (let i = 1; i <= nombrePlayer; i++) {
         customStats[i] = {
             highestMultiplier: arrayTouch[i]['highestMultiplier'] || 1,
             totalMultiplied: arrayTouch[i]['totalMultiplied'] || 0,
             jumps: arrayTouch[i]['jumps'] || 0
         };
     }
    // Récupérer le nom du joueur gagnant
    let winnerName = '';

    // Obtenir le nom depuis la zone d'affichage des scores
    const winnerNameElement = $('.zoneScorePlayer' + winner + ' .titlePlayer');
    if (winnerNameElement.length) {
        winnerName = winnerNameElement.text().trim();
    } else if (typeof playerNames !== 'undefined' && playerNames[winner-1]) {
        winnerName = playerNames[winner-1];
    } else {
        winnerName = 'Player ' + winner;
    }

    // Créer des confettis pour la célébration
    createConfetti();

    // Mettre à jour le résumé des scores
    updateScoreSummary(winner);

    // Afficher l'écran de victoire avec animation en séquence
    $('#zonevictory').fadeIn(500, function() {
        // Animation du nom du gagnant
        $('#zonevictoryPlayer').html(winnerName).hide().fadeIn(500, function() {
            // Affichage du "Play again?"
            $('#newGame').fadeIn(500, function() {
                // Affichage des boutons YES/NO
                $('#zonebtnno, #zonebtyes').fadeIn(500);
            });
        });
    });
     // Sauvegarde des statistiques
     saveGameStats(winner, "HyperJumpUp", customStats);
     
     // Affichage de l'écran de victoire
     $("#changePlayer").fadeOut();
     $("#newGame").fadeIn();
     $("#returnMenu").fadeIn();
     $("#zonevictory").fadeIn();
     $("#zonevictoryPlayer").html($('.zoneScorePlayer' + winner + ' .titlePlayer').text() || 'Joueur ' + winner);
     $("#zonebtnno").fadeIn();
     $("#zonebtyes").fadeIn();
}

function determineWinner(){
    let maxPoint = 1;
    let winner = 1;

    arrayTouch.forEach((item, index) => {
        if(item['point'] > maxPoint) {
            maxPoint = item['point'];
            winner = index;
        }else if (item['point'] === maxPoint
              && isCurrentPlayerHasBetterStatThanCurrentWinner(item, arrayTouch[winner]))
            winner = index;
    });

    return winner;
}

function exitEndChangePlayer(){
    arrayTouch[selectedPlayer]['nbMultiplierHittedRound'] = 0;
}
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

 function manageThrow(dart, number, zone){
    let numberTouched = determineNumberTouchs(zone);
    let multiplier  = 1;
    let point  = number;

    //Est-ce que la zone est ouverte et pas encore touchées
    // Il est necessaire de garder une distinction afin de déterminer les prochaines zones à afficher
    if ((arrayMultiplier[selectedPlayer].includes(number))
    && !(arrayHitted[selectedPlayer].includes(number))){
        //Si la bulle est ouverte, on ne compte la double bulle que comme une simple
        // et on récupère le nomnre de point afin de l'ajouter au point total (on double)
        if (number === 25) {
            numberTouched = 1;
            point = arrayTouch[selectedPlayer]['point'];
        }
        multiplier = updateAndApplyMultiplier(number, numberTouched);

    }else if (number === 25)
        //Mais si la bulle n'est pas encore débloquée, on compte la double bulle comme 50 points
        numberTouched = 2;

    let total = multiplier * numberTouched * point;

    arrayTouch[selectedPlayer]['point'] += total;
}

function updateAndApplyMultiplier(number, numberTouched){
    //On met à jour des valeurs du Multiplieurs, les zones ouvertes & les zones touchées
    updateMultiplierValues(numberTouched);
    updateMultiplierArea(numberTouched);
    updateHittedMultiplierArea(number);

    let currentMultiplier = (number === 25) ? 1 : arrayTouch[selectedPlayer]['multiplier'];

    //Le combo est déclenché lorsque le joueur touche une valeur ouverte 3 fois pendant un tour
    //Sinon, on retourne simplement la valeur du multiplicateur
    return currentMultiplier * (arrayTouch[selectedPlayer]['nbMultiplierHittedRound'] === 3 ? 3 : 1);
}

function updateMultiplierArea(numberTouched){
    let currentHigherNumber = arrayMultiplier[selectedPlayer].at(-1);

    if (currentHigherNumber === 25) return;

    //On ajoute autant de valeurs qu'il y a eu de nombre de touche (1, 2 ou 3)
    for (let i = 0; i < numberTouched && currentHigherNumber < 25 ; i++) {
        currentHigherNumber++;

        if (currentHigherNumber === 21 )
            currentHigherNumber = 25;

        arrayMultiplier[selectedPlayer].push(currentHigherNumber);
    }
}

function updateHittedMultiplierArea(number){
    arrayHitted[selectedPlayer].push(number);
}

function updateMultiplierValues(numberTouched){
    arrayTouch[selectedPlayer]['multiplier'] += numberTouched;
    arrayTouch[selectedPlayer]['nbMultiplierHittedRound']++;
}


function checkVictory(buttonTriggered){
    return buttonTriggered
        ? (round === maxRound && selectedPlayer === nombrePlayer)
        : (round === maxRound && selectedPlayer === nombrePlayer && nbThrow === 3);
}

function determineWinner(){
    let maxPoint = 1;
    let winner = 1;

    arrayTouch.forEach((item, index) => {
        if(item['point'] > maxPoint) {
            maxPoint = item['point'];
            winner = index;
        }else if (item['point'] === maxPoint
            && isCurrentPlayerBetterThanCurrentWinner(item, arrayTouch[winner]))
            winner = index;
    });

    return winner;
}

function exitEndChangePlayer(){
    arrayTouch[selectedPlayer]['nbMultiplierHittedRound'] = 0;
}

//Redetermination de fonction
function saveHistory(action){
    nbTotalAction++;

    if(action ==='dart')
        // arrayHistoryThrow[nbTotalAction] = $.extend(true, [], arrayTouch);
        arrayHistoryThrow[nbTotalAction] = {
            touch: $.extend(true, [], arrayTouch),
            multiplier: $.extend(true, [], arrayMultiplier),
            hitted: $.extend(true, [], arrayHitted)
        };
    else
        arrayHistoryThrow[nbTotalAction]= 'changePlayer';
}

function undoLastChangePlayer(){
    selectedPlayer !== 1 ? selectedPlayer-- : (selectedPlayer = nombrePlayer , round--);
    arrayHistoryThrow[nbTotalAction] = [];

    nbTotalAction--;
    nbThrow = arrayHistoryThrow[nbTotalAction]['touch'][selectedPlayer]["nbThrowRound"];
    if (nbThrow === undefined)
        nbThrow = 0;

    displayChangedPlayer();
}

function undoLastThrow(){
    arrayRound[round][selectedPlayer][nbThrow] = '';

    delete arrayHistoryThrow[nbTotalAction];

    nbThrow--;
    nbTotalAction--;

    // Check if previous action was ChangePlayer too
    if(arrayHistoryThrow[nbTotalAction] !== 'changePlayer'){
        if(nbTotalAction === 0)
            initGame();
        else
            arrayTouch = $.extend(true, [], arrayHistoryThrow[nbTotalAction]['touch']);
            arrayMultiplier = $.extend(true, [], arrayHistoryThrow[nbTotalAction]['multiplier']);
            arrayHitted = $.extend(true, [], arrayHistoryThrow[nbTotalAction]['hitted']);
    }
}

//Gestion d'affichage
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
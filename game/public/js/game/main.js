let selectedPlayer = 1;
let round =1;
let r = document.querySelector(':root'); //TODO rename DOM
const socket = io();
let nbThrow = 0;
let nbTotalAction = 0;
let isGameOver = false;
let isNewGame = false;
let isReturnMenu = false;
let isAskChangePlayer = false;
let arrayTouch = [];
let arrayRound = [];
let arrayHistoryThrow = [];
let previousTimestamp = 0;
let deltaTimestamp = 0;
let easterEggsRatio = 0.22;
let easterEggTimeOutClear = false;
let easterEggsRound = false;

// Variable pour enregistrer le temps de début de partie
window.gameStartTime = new Date().getTime();

initGame();
initRound();

socket.on('arduino', function(msg) {
    arduinoEvent(msg);
});

function initGame(){
    for(let i = 1; i <= nombrePlayer; i++)
        arrayTouch[i] = [];

    arrayTouch.forEach((item, index) => {
        arrayTouch[index]['point'] = 0;
        arrayTouch[index]['nbThrowRound'] = 0;
        // End game stat
        arrayTouch[index]['nbHit'] = 0;
        arrayTouch[index]['nbMiss'] = 0;
        arrayTouch[index]['nbSingle'] = 0;
        arrayTouch[index]['nbDouble'] = 0;
        arrayTouch[index]['nbTriple'] = 0;
        arrayTouch[index]['nbBull'] = 0;
        arrayTouch[index]['nbDoubleBull'] = 0;
    });

    arrayHistoryThrow[nbTotalAction] = $.extend(true, [], arrayTouch);
}

function initRound(){
    arrayRound[round] = [];
    for(let i = 1; i <= nombrePlayer; i++){
        arrayRound[round][i] = [];
        arrayRound[round][i][1] = '';
        arrayRound[round][i][2] = '';
        arrayRound[round][i][3] = '';
        arrayRound[round][i]['point'] = 0;
    }
}

function arduinoEvent(msg){
    let timestamp = Math.floor(Date.now());
    deltaTimestamp = timestamp - previousTimestamp;

    if(msg !== '' && msg !== 'btnNext' && deltaTimestamp >= '800' ){
        previousTimestamp = timestamp;

        if(msg === 'btnCancel'){
            if(nbTotalAction === 0)
                window.location.replace("/");

            else if(nbTotalAction === 1)
                window.location.reload()
        }

        if(!isGameOver)
            arduinoEventGameInProgress(msg);
        else
            arduinoEventGameOver(msg);
    }
}

function arduinoEventGameInProgress(msg) {
    displayEasterEggsTimeExceeded(msg);

    if(msg === 'btnValidate'){
        changePlayer();
        saveHistory('btn');

    }else if(msg === 'btnCancel'){
        undoLastAction();

    }else if (nbThrow < 3){
        if(!isAskChangePlayer){
            //We don't trigger the function when players hit the board when they remove darts
            nbThrow++;
            playThrow(msg);
            saveHistory('dart');
        }
    }
}

function arduinoEventGameOver(msg) {
    switch(msg) {
        case 'btnValidate':
                window.location.reload();
            break;

        case 'btnCancel':
            if(isNewGame)
                displayModalReturnMenu();
            break;
    }
}

function playThrow(msg){
    let dart = getDart(msg);
    arrayRound[round][selectedPlayer][nbThrow] = dart;
    arrayTouch[selectedPlayer]['nbThrowRound'] = nbThrow;

    console.log('playThrow - Zone : ' + dart);

    if(dart !== 'miss'){
        saveThrow(dart);
        displayRound();

    }else {
        // Exit for special management of certain games
        if (typeof exitPlayThrowMiss === "function")
            exitPlayThrowMiss();
        arrayTouch[selectedPlayer]['nbMiss']++;
        $('#throw' + nbThrow).html('miss');
    }

    displayEasterEggsPlayThrow();

    displayScore();
    manageEndTurn();
}

function getDart(msg){
    let result = targetMatrix[msg];
    return (result === undefined ? 'miss' : result);
}

function saveThrow(dart){
    let zone = dart.substring(0,1);
    let numberChar = dart.replace(zone,'');
    let number = parseInt(numberChar);

    manageStat(dart, number, zone);
    manageThrow(dart, number, zone);
}

function manageStat(dart, number, zone){
    arrayRound[round][selectedPlayer]['point'] += number * determineNumberTouchs(zone);

    if (arrayTargets.includes(number.toString())){
        arrayTouch[selectedPlayer]['nbHit'] ++;

        // Correspondance entre les zones et les stats
        const statMapping = { 'D25': 'nbDoubleBull',
                                   'S25': 'nbBull',
                                   'S': 'nbSingle',
                                   'D': 'nbDouble',
                                   'T': 'nbTriple' };

        if (statMapping[dart])
            arrayTouch[selectedPlayer][statMapping[dart]]++;
    }
}

function manageEndTurn(){
    if (checkVictory('')){
        isGameOver = true;
        displayVictoryScreen();
    }
    else if(nbThrow === 3)
        displayModalChangePlayer();
}

function changePlayer(){
    nbThrow = 0;
    $('#changePlayer').hide();
    const selectors = ['#throw1', '#throw2', '#throw3'];

    selectors.forEach(selector => {
        $(selector).removeClass('TripleShot').removeClass('DoubleShot').html('-');
    });

    if(checkVictory(true)){
        displayVictoryScreen();
        isGameOver = true;
    }

    else if (selectedPlayer === nombrePlayer)
        newRound();
    else{
        selectedPlayer += 1;
        displayChangedPlayer();
    }

    // Exit pour certains jeux
    if (typeof exitEndChangePlayer === "function")
        exitEndChangePlayer();

    isAskChangePlayer = false;
    displayScore();
}

function saveHistory(action){
    nbTotalAction++;

    if(action ==='dart')
        arrayHistoryThrow[nbTotalAction] = $.extend(true, [], arrayTouch);
    else
        arrayHistoryThrow[nbTotalAction]= 'changePlayer';
}

function undoLastAction(){
    $('#changePlayer').hide();
    isAskChangePlayer = false;

    if(arrayHistoryThrow[nbTotalAction] === 'changePlayer')
        undoLastChangePlayer();
    else
        undoLastThrow();

    displayScore();
    displayRound();
}

function undoLastChangePlayer(){
    selectedPlayer !== 1 ? selectedPlayer-- : (selectedPlayer = nombrePlayer , round--);
    arrayHistoryThrow[nbTotalAction] = [];

    nbTotalAction--;
    nbThrow = arrayHistoryThrow[nbTotalAction][selectedPlayer]["nbThrowRound"];
    if (nbThrow === undefined)
        nbThrow = 0;

    displayChangedPlayer();
}
function undoLastThrow(){
    arrayRound[round][selectedPlayer][nbThrow] = '';
    // arrayHistoryThrow[nbTotalAction] = [];
    // arrayHistoryThrow.splice(nbTotalAction, 1);

    delete arrayHistoryThrow[nbTotalAction];

    nbThrow--;
    nbTotalAction--;

    // Check if previous action was ChangePlayer too
    if(arrayHistoryThrow[nbTotalAction] !== 'changePlayer'){
        if(nbTotalAction === 0)
            initGame();
        else
            arrayTouch = $.extend(true, [], arrayHistoryThrow[nbTotalAction]);
    }
}


function newRound(){
    if(round !== maxRound){
        round ++;
        selectedPlayer = 1;

        initRound();
        displayChangedPlayer();
    }
}

function isCurrentPlayerBetterThanCurrentWinner(player, currentWinner){
    const keys = ['nbHit', 'nbDoubleBull', 'nbBull', 'nbTriple', 'nbDouble', 'nbSingle'];

    for (const key of keys) {
        if (player[key] < currentWinner[key]) {
            return false;
        }
        if (player[key] > currentWinner[key]) {
            return true;
        }
    }
    return true;
}

function setHtmlHistoryRound(idRound, numberRound, listeScore){
    let selectorHR1 = $('#HistoryRound'+idRound);
    selectorHR1.find('.T1').html('');
    selectorHR1.find('.T2').html('');
    selectorHR1.find('.T3').html('');
    selectorHR1.find('.title').html('R'+numberRound+' :');

    let displayThrow = (numberRound === round) ? nbThrow : 3;

    for(let i=1;i<=displayThrow;i++){
        selectorHR1.find('.T'+i).html(getHtmlThrowLastRound(listeScore[i]));
    }
}

function isTargetTouched(dart){
    let area = dart.substring(1);

    return arrayTargets.includes(area);
}

function resetGlobal(){
    selectedPlayer = 1;
    round =1;
    nbThrow = 0;
    nbTotalAction = 0;
    isGameOver = false;
    isNewGame = false;
    isReturnMenu = false;
    arrayTouch = [];
    arrayRound = [];
    arrayHistoryThrow = [];

    initRound();
    initGame(nombrePlayer);
    displayRound();
    displayChangedPlayer();

    $('#changePlayer').hide();
    $('#newGame').hide();
    $('#returnMenu').hide();
    $('#zonevictory').hide();
    $('#bodyHistoryRound').find("td").html(" ");
    $('#bodyHistoryRound').find(".title").first().html("R1 :");
}

function getHtmlThrow(i){
    return i === 1 ? '/'
         : i === 2 ? 'X'
         : i === 3 ? 'Ø'
         :           '';
}

function getHtmlThrowLastRound(dart){
    return !isTargetTouched(dart) ? '-'
         : dart.indexOf("S") >= 0 ? '/'
         : dart.indexOf("D") >= 0 ? 'X'
         : dart.indexOf("T") >= 0 ? 'Ø'
         :                                '-';
}

function determineZoneText(zone){
    return zone === "S" ? "Single"
         : zone === "D" ? "Double"
         :                "Triple";
}

function determineNumberTouchs(zone){
    return zone === "S" ? 1
         : zone === "D" ? 2
         :                3;
}

function isEasterEggsDisplay(){
    return Math.random() < easterEggsRatio;
}

function easterEggsIsRoundSameThrows(target){
    if (arrayRound[round][selectedPlayer][1].includes(target)
    &&  arrayRound[round][selectedPlayer][2].includes(target)
    &&  arrayRound[round][selectedPlayer][3].includes(target))
        return true;
}

function easterEggsIsRoundSameThrowsValue(target){
    let zone = target.substring(0,1);
    let numberChar = target.replace(zone,'');
    let number = parseInt(numberChar);
}

// Initialisation des statistiques de jeu
function initGameStats() {
    // Initialiser le temps de début de jeu
    window.gameStartTime = new Date().getTime();
    
    // Initialiser les statistiques pour chaque joueur
    for (let i = 1; i <= nombrePlayer; i++) {
        if (!arrayTouch[i]) {
            arrayTouch[i] = {};
        }
        
        // Stats de base
        arrayTouch[i]['nbHit'] = 0;
        arrayTouch[i]['nbMiss'] = 0;
        arrayTouch[i]['nbSingle'] = 0;
        arrayTouch[i]['nbDouble'] = 0;
        arrayTouch[i]['nbTriple'] = 0;
        arrayTouch[i]['nbBull'] = 0;
        arrayTouch[i]['nbDoubleBull'] = 0;
    }
}

// Mise à jour des statistiques lors d'un lancer
function updateStats(player, zone, number) {
    // Si c'est un miss, incrémenter le compteur de miss
    if (zone === 'miss') {
        arrayTouch[player]['nbMiss']++;
        return;
    }
    
    // Incrémenter le compteur de hit
    arrayTouch[player]['nbHit']++;
    
    // Comptabiliser par type de zone
    if (zone === 'S') {
        arrayTouch[player]['nbSingle']++;
    } else if (zone === 'D') {
        arrayTouch[player]['nbDouble']++;
    } else if (zone === 'T') {
        arrayTouch[player]['nbTriple']++;
    }
    
    // Comptabiliser les Bulls
    if (number === '25') {
        if (zone === 'S') {
            arrayTouch[player]['nbBull']++;
        } else if (zone === 'D') {
            arrayTouch[player]['nbDoubleBull']++;
        }
    }
}

// Modification de la fonction addThrow existante pour inclure le suivi des statistiques
function addThrow(target, zone, isVictory = false) {
    if (nbTotalAction === 3) {
        return;
    }

    // Mettre à jour l'historique des lancers
    if (target === "miss") {
        arrayRound[round][selectedPlayer][nbThrow + 1] = "miss";
        // Mettre à jour les statistiques pour un lancer manqué
        if (!arrayTouch[selectedPlayer]['nbMiss']) {
            arrayTouch[selectedPlayer]['nbMiss'] = 0;
        }
        arrayTouch[selectedPlayer]['nbMiss']++;
    } else {
        let targetPosition = determinePosition(target);
        let targetZone = determineZone(zone);

        if (targetPosition === 25) {
            if (targetZone === "D") {
                target = 50;
                // Mettre à jour les statistiques pour un double bull
                if (!arrayTouch[selectedPlayer]['nbDoubleBull']) {
                    arrayTouch[selectedPlayer]['nbDoubleBull'] = 0;
                }
                arrayTouch[selectedPlayer]['nbDoubleBull']++;
            } else {
                target = 25;
                // Mettre à jour les statistiques pour un bull simple
                if (!arrayTouch[selectedPlayer]['nbBull']) {
                    arrayTouch[selectedPlayer]['nbBull'] = 0;
                }
                arrayTouch[selectedPlayer]['nbBull']++;
            }
            targetPosition = target;
            targetZone = "S";
        }

        // Mettre à jour les statistiques selon le type de zone touchée
        if (!arrayTouch[selectedPlayer]['nbHit']) {
            arrayTouch[selectedPlayer]['nbHit'] = 0;
        }
        arrayTouch[selectedPlayer]['nbHit']++;

        if (targetZone === "S" && targetPosition !== 25 && targetPosition !== 50) {
            if (!arrayTouch[selectedPlayer]['nbSingle']) {
                arrayTouch[selectedPlayer]['nbSingle'] = 0;
            }
            arrayTouch[selectedPlayer]['nbSingle']++;
        } else if (targetZone === "D") {
            if (!arrayTouch[selectedPlayer]['nbDouble']) {
                arrayTouch[selectedPlayer]['nbDouble'] = 0;
            }
            arrayTouch[selectedPlayer]['nbDouble']++;
        } else if (targetZone === "T") {
            if (!arrayTouch[selectedPlayer]['nbTriple']) {
                arrayTouch[selectedPlayer]['nbTriple'] = 0;
            }
            arrayTouch[selectedPlayer]['nbTriple']++;
        }

        arrayRound[round][selectedPlayer][nbThrow + 1] = targetZone + targetPosition;
        manageThrow(targetPosition, target, targetZone);
    }

    nbThrow++;
    nbTotalAction++;

    if (nbThrow === 3) {
        manageNbThrow();
    }

    displayScore();

    // Vérifier la victoire après la mise à jour du score
    if (checkVictory(isVictory)) {
        displayVictoryScreen();
    }
}

// Fonction pour mettre à jour le résumé des scores dans l'écran de victoire
function updateScoreSummary(winner) {
    let summaryHTML = '<div class="score-table">';

    // En-tête du tableau
    summaryHTML += '<div class="score-row header">';
    summaryHTML += '<div class="score-cell">Player</div>';
    summaryHTML += '<div class="score-cell">Points</div>';
    summaryHTML += '<div class="score-cell">Precision</div>';
    summaryHTML += '</div>';

    // Lignes pour chaque joueur
    for (let i = 1; i <= nombrePlayer; i++) {
        const isWinner = (i === winner);

        // Récupérer le nom du joueur à partir du DOM - utiliser différents sélecteurs possibles
        let playerName = '';

        // Tenter plusieurs sélecteurs pour trouver les noms
        // 1. D'abord avec l'ID zoneScorePlayer
        if ($('#zoneScorePlayer' + i + ' .titlePlayer').length) {
            playerName = $('#zoneScorePlayer' + i + ' .titlePlayer').text().trim();
        }
        // 2. Ensuite avec la classe zoneScorePlayer
        else if ($('.zoneScorePlayer' + i + ' .titlePlayer').length) {
            playerName = $('.zoneScorePlayer' + i + ' .titlePlayer').text().trim();
        }
        // 3. Utiliser le tableau playerNames s'il est disponible
        else if (typeof playerNames !== 'undefined' && playerNames[i-1]) {
            playerName = playerNames[i-1];
        }
        // 4. Enfin, utiliser un nom de joueur par défaut
        else {
            playerName = 'Player ' + i;
        }

        // Filtrer les espaces supplémentaires ou les caractères superflus
        playerName = playerName.replace(/\s+/g, ' ').trim();

        console.log("Récupération du nom du joueur " + i + " (sélecteur ajusté):", playerName);

        const playerPoints = arrayTouch[i]['point'] || 0;

        // Calculer la précision
        const hits = arrayTouch[i]['nbHit'] || 0;
        const misses = arrayTouch[i]['nbMiss'] || 0;
        const totalThrows = hits + misses;
        const precision = totalThrows > 0 ? Math.round((hits / totalThrows) * 100) : 0;

        summaryHTML += '<div class="score-row ' + (isWinner ? 'winner' : '') + '">';
        summaryHTML += '<div class="score-cell">' + playerName + '</div>';
        summaryHTML += '<div class="score-cell">' + playerPoints + '</div>';
        summaryHTML += '<div class="score-cell">' + precision + '%</div>';
        summaryHTML += '</div>';
    }

    summaryHTML += '</div>';

    // Mettre à jour l'élément HTML
    $('.score-summary').html(summaryHTML);
}

// Appeler l'initialisation des statistiques au démarrage du jeu
window.addEventListener('load', function() {
    initGameStats();
});
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
let easterEggsRatio = 0.44;
let easterEggTimeOutClear = false;

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

        if(nbTotalAction === 0 && msg === 'btnCancel')
            window.location.replace("/");

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
            if(isNewGame)
                window.location.reload();
            if(isReturnMenu)
                window.location.replace('/');
            break;

        case 'btnCancel':
            if(isNewGame)
                displayModalReturnMenu();
            if(isReturnMenu) {
                isReturnMenu = false;
                $('#returnMenu').hide();
                $('#zonebtnno').hide();
                $('#zonebtyes').hide();
                undoLastAction();
                }
            break;

        default:
            // Restart a game by throwing a dart after 5 seconds
            let dart = getDart(msg);
            if(deltaTimestamp >= '5000' && nbThrow === 3 && dart !== 'undefined' && dart !== null){
                resetGlobal();
                arduinoEventGameInProgress(msg);
            }
    }
}

function playThrow(msg){
    let dart = getDart(msg);
    arrayRound[round][selectedPlayer][nbThrow] = dart;
    arrayTouch[selectedPlayer]['nbThrowRound'] = nbThrow;

    console.log(dart);

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

        if (dart === 'D25')
            arrayTouch[selectedPlayer]['nbDoubleBull']++;
        else if (dart === 'S25')
            arrayTouch[selectedPlayer]['nbBull']++;
        else if (zone === 'S')
            arrayTouch[selectedPlayer]['nbSingle']++;
        else if(zone === 'D')
            arrayTouch[selectedPlayer]['nbDouble']++;
        else if(zone === 'T')
            arrayTouch[selectedPlayer]['nbTriple']++;
    }
}

function manageEndTurn(){
    if (checkVictory(''))
        displayVictoryScreen();
    else if(nbThrow === 3)
        displayModalChangePlayer();
}

function changePlayer(){
    nbThrow = 0;
    $('#changePlayer').hide();
    let selector1 = $('#throw1');
    let selector2 = $('#throw2');
    let selector3 = $('#throw3');
    selector1.removeClass('TripleShot').removeClass('DoubleShot').html('-');
    selector2.removeClass('TripleShot').removeClass('DoubleShot').html('-');
    selector3.removeClass('TripleShot').removeClass('DoubleShot').html('-');

    if(checkVictory(true))
        displayVictoryScreen();
    else if (selectedPlayer === nombrePlayer)
        newRound();
    else{
        selectedPlayer += 1;
        displayChangedPlayer();
    }

    // Exit for special management of certain games
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

    if(nbTotalAction > 0){
        if(arrayHistoryThrow[nbTotalAction] === 'changePlayer')
            undoLastChangePlayer();
        else
            undoLastThrow();

        displayScore();
        displayRound();
    }
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
    arrayHistoryThrow[nbTotalAction] = [];

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

function isCurrentPlayerHasBetterStatThanCurrentWinner(player, currentWinner){
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
         : dart.indexOf("T") >= 0 ? 'O'
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
let selectedPlayer = 1;
let round =1;
let r = document.querySelector(':root');
const socket = io()
let nbThrow = 0;
let nbTotalAction = 0;
let isGameOver = false;
let isNewGame = false;
let isReturnMenu = false;
let arrayTouch = [];
let arrayRound = [];
let arrayHistoryThrow = [];
let previousTimestamp = 0;

initRound();

socket.on('arduino', function(msg) {
    arduinoEvent(msg);
});

function initRound(){
    arrayRound[round] = [];
    for(let i = 1; i <= nombrePlayer; i++){
        arrayRound[round][i] = [];
        arrayRound[round][i][1] = '';
        arrayRound[round][i][2] = '';
        arrayRound[round][i][3] = '';
    }
}

function arduinoEvent(msg){
    let timestamp   = Math.floor(Date.now());
    let deltaTimestamp = timestamp - previousTimestamp;

    if(msg !== '' && deltaTimestamp >= '800' ){
        previousTimestamp = timestamp;

        if(isGameOver === false )
            arduinoEventGameInProgress(msg);
        else
            arduinoEventGameOver(msg);

        console.log(arrayHistoryThrow);
    }
}

function arduinoEventGameInProgress(msg) {
    if(msg === 'btnValidate'){
        changePlayer();
        saveHistory('btn');
    }else if(msg === 'btnCancel'){
        undoLastAction();
    }else if (nbThrow < 3){
        //We don't trigger the function when players hit the board when they remove darts
        nbThrow++;
        playThrow(msg);
        saveHistory('dart');
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
                undoLastAction();
                }
            break;

        default:
            // Restart a game by throwing a dart after 5 seconds
            let dart = getDart(msg);
            if(deltaTimestamp >= '5000' && nbThrow === 3 && dart !== 'undefined' && dart !== null)
                window.location.reload();
    }
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

    if(selectedPlayer === nombrePlayer){
        newRound()
    }else{
        selectedPlayer = selectedPlayer+1;
        displayChangedPlayer();
    }

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

    if(nbTotalAction > 0){

        console.log(nbTotalAction);

        if(arrayHistoryThrow[nbTotalAction] !== 'changePlayer'){

            arrayRound[round][selectedPlayer][nbThrow] = '';
            arrayHistoryThrow[nbTotalAction] = [];

            nbThrow--;
            nbTotalAction--;
            
            if(arrayHistoryThrow[nbTotalAction] !== 'changePlayer'){
                if(nbTotalAction === 0)
                    initGame();
                else
                    arrayTouch = $.extend(true, [], arrayHistoryThrow[nbTotalAction]);
            }

        }else{
            selectedPlayer !== 1 ? selectedPlayer-- : (selectedPlayer = nombrePlayer , round--);
            arrayHistoryThrow[nbTotalAction] = [];

            nbTotalAction--;
            nbThrow = arrayHistoryThrow[nbTotalAction][selectedPlayer]["nbThrowRound"];

            displayChangedPlayer();
        }

        displayScore();
        displayHistoryRound();
    }
}

function playThrow(msg){
    let dart = getDart(msg);
    arrayRound[round][selectedPlayer][nbThrow] = dart;

    if(dart !== 'miss'){
        saveDart(dart);
    }else{
        $('#throw'+nbThrow).html('miss');
    }

    displayScore();
    manageEndTurn();
}

function getDart(msg){
    let result = targetMatrix[msg];
    return (result === undefined ? 'miss' : result);
}

function newRound(){
    if(round !== maxRound){
        round ++;
        selectedPlayer = 1;

        initRound();
        displayChangedPlayer();
    }
}

function manageEndTurn(){
    if (checkVictory())
        displayVictoryScreen();
    else if(nbThrow === 3)
        displayModalChangePlayer();
}

function saveDart(dart){
    let zone = dart.substring(0,1);

    dart = dart.replace(zone,'');
    let score = parseInt(dart);

    displayHistoryRound();
    saveScore(score, dart, zone);
}

function setHtmlHistoryRound(idRound,numberRound, listeScore){
    let selectorHR1 = $('#HistoryRound'+idRound);
    selectorHR1.find('.T1').html('');
    selectorHR1.find('.T2').html('');
    selectorHR1.find('.T3').html('');
    selectorHR1.find('.title').html('R'+numberRound+' :');

    for(let i=1;i<=3;i++){
        selectorHR1.find('.T'+i).html(getHtmlThrowLastRound(listeScore[i]));
    }
}

function saveTouch(dart, position){
    let numberTouch = determineNumberTouchs(position);
    arrayTouch[selectedPlayer][dart] = arrayTouch[selectedPlayer][dart] + numberTouch;
    arrayTouch[selectedPlayer]['nbThrowRound'] = nbThrow;
}

function getHtmlThrow(i){
    return i === 1 ? '/'
         : i === 2 ? 'X'
         : i === 3 ? '0'
         :           '';
}

function getHtmlThrowLastRound(dart){
    return dart.indexOf("S") >= 0 ? '/'
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
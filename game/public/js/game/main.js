let selectedPlayer = 1;
let round =1;
let r = document.querySelector(':root');
const socket = io()
let nbThrow = 0;
let nbTotalThrow = 0;
let lastMsg = '';
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

function arduinoEvent(msg){
    let timestamp = Math.floor(Date.now());
    let deltaTimestamp = timestamp - previousTimestamp;

    if(msg !== '' && deltaTimestamp >= '900' && isGameOver === false ){

        previousTimestamp = timestamp;

        if(msg === 'btnValidate'){
            changePlayer();
            saveHistory('btn');
        }else if(msg === 'btnCancel'){
            undoLastThrow();
        }else if (nbThrow < 3){
            //We don't trigger the function when players hit the board when they remove darts
            nbThrow++;
            playThrow(msg);
            saveHistory('touch');
        }
    }
    else{
        if(msg === 'btnValidate'){
            if(isNewGame && !isReturnMenu)
                location.window.reload();
        }else if(msg === 'btnCancel'){
            if(isNewGame){
                displayModalReturnMenu();
            }else if(isReturnMenu){
                isReturnMenu = false;
                $('#returnMenu').hide();
                undoLastThrow();
            }
        }
    }
}

function initRound(){
    arrayRound[round] = [];
    for(let i = 1; i <= nombrePlayer; i++){
        arrayRound[round][i] = [];
        arrayRound[round][i][1] = '';
        arrayRound[round][i][2] = '';
        arrayRound[round][i][3] = '';
    }
}

function newRound(){
    if(round === maxRound){
        displayVictoryScreen();
    }else{
        round = round + 1;
        initRound();
        selectedPlayer = 1
        displayChangedPlayer();
    }
}

function getDart(msg){
    let result = targetMatrix[msg];
    if(result != undefined){
        return result;
    }else{
        return 'miss';
    }
}

function playThrow(msg){
    let dart = getDart(msg);
    arrayRound[round][selectedPlayer][nbThrow] = dart;

    if(dart !== 'miss'){
        saveDart(dart);
        displayScore();
    }else{
        $('#throw'+nbThrow).html('miss');
        displayScore();
    }

    if (checkVictory()){
        displayVictoryScreen();
    }

    if(nbThrow === 3 && !checkVictory()){
        displayModalChangePlayer();
    }
    saveHistoryThrow();
}

function displayModalChangePlayer(){
    $('#changePlayer').show()
    displayScore()
}

function saveHistory(action){

    nbTotalThrow++;
    if(action ==='touch'){
        arrayHistoryThrow[nbTotalThrow] = $.extend(true, [], arrayTouch);
    }else{
        arrayHistoryThrow[nbTotalThrow] = 'changePlayer';
    }
}

function undoLastThrow(){
    $('#changePlayer').hide();
    if(nbTotalThrow > 0){
        if(arrayHistoryThrow[nbTotalThrow] !== 'changePlayer'){
            arrayRound[round][selectedPlayer][nbThrow] = '';
            nbThrow--;
            arrayHistoryThrow[nbTotalThrow] = [];

            nbTotalThrow--;
            arrayTouch = $.extend(true, [], arrayHistoryThrow[nbTotalThrow]);

        }else{
            if(selectedPlayer !== 1){
                nbThrow = 3;
                selectedPlayer--;
            }else{
                nbThrow = 3;
                round--;
                selectedPlayer = nombrePlayer;
            }
            arrayHistoryThrow[nbTotalThrow] = [];

            nbTotalThrow--;
            displayChangedPlayer();

        }
        displayScore();
        displayHistoryRound();
    }
}

function saveDart(dart){
    let zone = dart.substring(0,1);

    dart = dart.replace(zone,'');
    displayHistoryRound();
    let score = parseInt(dart);
    saveScore(score, dart,zone);
}

function setHtmlHistoryRound(idRound,numberRound, listeScore){
    let selectorHR1 = $('#HistoryRound'+idRound);
    selectorHR1.find('.T1').html('');
    selectorHR1.find('.T2').html('');
    selectorHR1.find('.T3').html('');
    selectorHR1.find('.title').html('R'+numberRound+' :');
    for(let i=1;i<=3;i++){
        selectorHR1.find('.T'+i).html(getHtmlThrowLastRound(listeScore[i]));
        console.log();
    }
}

function getHtmlThrow(i){
    if(i === 1){
        return '/';
    }
    if(i === 2){
        return 'X';
    }
    if(i === 3){
        return 'O';
    }
}
function getHtmlThrowLastRound(dart){
    let dartInt = dart.substring(1);

    if (arrayTouch.length > 0 || !(dartInt in arrayTouch[selectedPlayer])){
        return '-';
    }

    if(dart.indexOf("S") >= 0){
        return '/';
    }else if(dart.indexOf("D") >= 0){
        return 'X';
    }else if(dart.indexOf("T") >= 0){
        return 'O';
    }else{
        return '-';
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

function displayModalReturnMenu(){
    $('#newGame').hide();
    $('#returnMenu').show();
    isNewGame = false;
    isReturnMenu = true;
}
function displayHistoryRound(){
    for(let i = 1; i <= 3; i++){
        if(i <= nbThrow){
            let zoneText;
            let dartString;
            let dart;
            if(arrayRound[round][selectedPlayer][i] === 'miss'){
                zoneText = "miss";
                dartString = '';
            }else{
                let zone = arrayRound[round][selectedPlayer][i].substring(0,1);
                zoneText = getTextDart(zone);
                dart = arrayRound[round][selectedPlayer][i].replace(zone,'');
                (dart==="25") ? dartString = "Bull" : dartString = dart;
            }

            $('#throw'+i).html(zoneText+' '+dartString);
            $('#throw'+i).addClass(zoneText+'Shot');
        }else{
            $('#throw'+i).removeClass('TripleShot').removeClass('DoubleShot').html('-');
        }
    }
}

function displayChangedPlayer(){
    if(selectedPlayer === 1){
        r.style.setProperty('--main-bg-color', '#f44336');
        r.style.setProperty('--main-bg-color-darker', '#c62828');
    }
    if(selectedPlayer === 2){
        r.style.setProperty('--main-bg-color', '#ffeb3b');
        r.style.setProperty('--main-bg-color-darker', '#ab9d26');
    }
    if(selectedPlayer === 3){
        r.style.setProperty('--main-bg-color', '#2fc536');
        r.style.setProperty('--main-bg-color-darker', '#1d8122');
    }
    if(selectedPlayer === 4){
        r.style.setProperty('--main-bg-color', '#03a9f4');
        r.style.setProperty('--main-bg-color-darker', '#016795');
    }

    $('#nbRound').html(round);
    $('.tdGame').removeClass('selected');
    $('.scorePlayer').removeClass('selected');
    $('.tdPlayer'+selectedPlayer).addClass('selected');
    $('#zoneScorePlayer'+selectedPlayer).addClass('selected');
}
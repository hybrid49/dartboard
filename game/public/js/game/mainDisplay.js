function displayModalChangePlayer(){
    isAskChangePlayer = true;
    $('#changePlayer').show()
    displayScore()
}

function displayModalReturnMenu(){
    $('#newGame').hide();
    $('#returnMenu').show();
    $('#zonebtnno').show();
    $('#zonebtyes').show();
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
                zoneText = determineZoneText(zone);
                dart = arrayRound[round][selectedPlayer][i].replace(zone,'');
                (dart==="25") ? dartString = "Bull" : dartString = dart;
            }

            $('#throw'+i).html(zoneText+' '+dartString);

            if (isTargetTouched(arrayRound[round][selectedPlayer][i]))
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
        r.style.setProperty('--main-bg-color-darker-transparent', '#f4433663');
    }
    if(selectedPlayer === 2){
        r.style.setProperty('--main-bg-color', '#fdd835');
        r.style.setProperty('--main-bg-color-darker', '#c7aa2b');
        r.style.setProperty('--main-bg-color-darker-transparent', '#fdd83563');
    }
    if(selectedPlayer === 3){
        r.style.setProperty('--main-bg-color', '#2fc536');
        r.style.setProperty('--main-bg-color-darker', '#1d8122');
        r.style.setProperty('--main-bg-color-darker-transparent', '#2fc53663');
    }
    if(selectedPlayer === 4){
        r.style.setProperty('--main-bg-color', '#03a9f4');
        r.style.setProperty('--main-bg-color-darker', '#016795');
        r.style.setProperty('--main-bg-color-darker-transparent', '#03a9f463');
    }

    $('#nbRound').html(round);
    $('.tdGame').removeClass('selected');
    $('.scorePlayer').removeClass('selected');
    $('.tdPlayer'+selectedPlayer).addClass('selected');
    $('#zoneScorePlayer'+selectedPlayer).addClass('selected');
}

function displayEasterEggsArduinoEvent(deltaTimestamp){
    // TODO : Faire fonctionner cette méthode avec un SetTimeOut plutot qu'au
    // TODO :  lanceement d'unenouvelle flechette car c'est plus logique
    if (isEasterEggsDisplay() && !isGameOver){
        let len = deltaTimestamp.toString().length;

        if (len > 5 && deltaTimestamp > 60000)
            displayAtWhatTime();
    }
}

function displayAtWhatTime(){

}

function displayEasterEggsPlayThrow(){
    // fews easterEgg doesn't happen all the time
    if (isEasterEggsDisplay()){
        displayLoser();
        displaySlotMachine();
        displayUniverseAnswer();
        displayBigBoss();
    }
    displayNewBestScoreAllTime();
}

function displayLoser(){
    // TODO : Valeur du round = miss / miss / miss
}

function displaySlotMachine(){
    // TODO : Valeur du round = S7 / S7 / S7
}

function displayUniverseAnswer(){
    // TODO : Valeur du round = 42
}

function displayNewBestScoreAllTime(){
    // TODO : Faire apparaitre une vidéo de Macron, disant qu'il ferait mieux de traverser la rue
}

function displayBigBoss(){
    // TODO : Valeur du round = bull / bull / bull
}

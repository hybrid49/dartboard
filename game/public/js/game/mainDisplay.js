let timeOutID = 0;

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

function displayRound(){
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
        r.style.setProperty('--main-bg-color-lighter', '#f8766d');
        r.style.setProperty('--main-bg-color-darker-transparent', '#f4433663');
    }
    if(selectedPlayer === 2){
        r.style.setProperty('--main-bg-color', '#fdd835');
        r.style.setProperty('--main-bg-color-darker', '#c7aa2b');
        r.style.setProperty('--main-bg-color-lighter', '#fadf69');
        r.style.setProperty('--main-bg-color-darker-transparent', '#fdd83563');
    }
    if(selectedPlayer === 3){
        r.style.setProperty('--main-bg-color', '#2fc536');
        r.style.setProperty('--main-bg-color-darker', '#1d8122');
        r.style.setProperty('--main-bg-color-lighter', '#4fc255');
        r.style.setProperty('--main-bg-color-darker-transparent', '#2fc53663');
    }
    if(selectedPlayer === 4){
        r.style.setProperty('--main-bg-color', '#03a9f4');
        r.style.setProperty('--main-bg-color-darker', '#016795');
        r.style.setProperty('--main-bg-color-lighter', '#55c7fa');
        r.style.setProperty('--main-bg-color-darker-transparent', '#03a9f463');
    }
    if(selectedPlayer === 5){
        r.style.setProperty('--main-bg-color', '#ff9800');
        r.style.setProperty('--main-bg-color-darker', '#c97801');
        r.style.setProperty('--main-bg-color-lighter', '#fdb953');
        r.style.setProperty('--main-bg-color-darker-transparent', '#ff980063');
    }
    if(selectedPlayer === 6){
        r.style.setProperty('--main-bg-color', '#9c27b0');
        r.style.setProperty('--main-bg-color-darker', '#9805b0');
        r.style.setProperty('--main-bg-color-lighter', '#b04fc0');
        r.style.setProperty('--main-bg-color-darker-transparent', '#9c27b063');
    }
    if(selectedPlayer === 7){
        r.style.setProperty('--main-bg-color', '#ff00bc');
        r.style.setProperty('--main-bg-color-darker', '#fd4bce');
        r.style.setProperty('--main-bg-color-lighter', '#bb018a');
        r.style.setProperty('--main-bg-color-darker-transparent', '#ff00bc63');
    }
    if(selectedPlayer === 8){
        r.style.setProperty('--main-bg-color', '#00f3ff');
        r.style.setProperty('--main-bg-color-darker', '#02b1b9');
        r.style.setProperty('--main-bg-color-lighter', '#44f1fa');
        r.style.setProperty('--main-bg-color-darker-transparent', '#00f3ff63');
    }

    $('#nbRound').html(round);
    $('.tdGame').removeClass('selected');
    $('.scorePlayer').removeClass('selected');
    $('.tdPlayer'+selectedPlayer).addClass('selected');
    $('#zoneScorePlayer'+selectedPlayer).addClass('selected');
}

function displayEasterEggsTimeExceeded(msg){
    if (easterEggTimeOutClear
    ||  msg === 'btnCancel'
    ||  nbThrow === 3){
        console.log('clear');
        clearTimeout(timeOutID);}
    else{
        let timestamp = Math.floor(Date.now());
        deltaTimestamp = timestamp - previousTimestamp;

        timeOutID = setTimeout(function (){
            if (deltaTimestamp > 50000) {
                $('#timeExceed').show().delay(3000).fadeOut("fast");
                easterEggTimeOutClear = true;
            }
            displayEasterEggsTimeExceeded();
        }, 500);
    }
}

function displayEasterEggsPlayThrow(){
    // fews easterEgg doesn't happen all the time
    if (nbThrow === 3){
        if (isEasterEggsDisplay()){
            displayLoser();
            displayBoss();
            displaySlotMachine();
            displayUniverseAnswer();
        }
        displayNewBestScoreAllTime();
    }
}

function displayLoser(){
    // // Valeur du round = miss / miss / miss
    // if (easterEggsIsRoundSameThrows('miss'))
    //     $('#newGame').show().delay(3000).fadeOut("fast");
}

function displaySlotMachine(){
    // // Valeur du round = S7 / S7 / S7
    // if (easterEggsIsRoundSameThrows('S7'))
    //     $('#newGame').show().delay(3000).fadeOut("fast");
}

function displayBoss(){
    // // Valeur du round = DBull / DBull / DBull
    // if (easterEggsIsRoundSameThrows('DBull'))
    //     $('#newGame').show().delay(3000).fadeOut("fast");
    //
    // // Valeur du round = bull / bull / bull
    // else if (easterEggsIsRoundSameThrows('bull'))
    //     $('#newGame').show().delay(3000).fadeOut("fast");
}

function displayUniverseAnswer(){
    // // Valeur du round = 42 avec 3 flechettes touchées
    // if (arrayRound[round][selectedPlayer]['point'] === 42)
    //     $('#newGame').show().delay(3000).fadeOut("fast");
}

function displayNewBestScoreAllTime(){
    // TODO : Faire apparaitre une vidéo de Macron, disant qu'il ferait mieux de traverser la rue
}


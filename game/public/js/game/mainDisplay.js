function displayModalChangePlayer(){
    $('#changePlayer').show()
    displayScore()
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
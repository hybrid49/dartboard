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
    // Si nous avons des données de couleur pour ce joueur, les utiliser
    if (typeof playerData !== 'undefined' && playerData[selectedPlayer-1]) {
        const player = playerData[selectedPlayer-1];
        r.style.setProperty('--main-bg-color', player.color);
        r.style.setProperty('--main-bg-color-darker', player.colorDarker);
        r.style.setProperty('--main-bg-color-darker-transparent', player.colorTransparent);
    } 
    // Sinon, utiliser les couleurs par défaut basées sur le numéro du joueur
    else {
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
        console.log('clearTimeOut');
        clearTimeout(timeOutID);}
    else{
        let timestamp = Math.floor(Date.now());
        deltaTimestamp = timestamp - previousTimestamp;

        timeOutID = setTimeout(function (){
            if (deltaTimestamp > 50000) {
                if(isEasterEggsDisplay)
                    return;
                $('#timeExceed').show().delay(3000).fadeOut("fast");
                easterEggTimeOutClear = true;
            }
            displayEasterEggsTimeExceeded();
        }, 500);
    }
}

function displayEasterEggsPlayThrow(){
    easterEggsRound = false;

    if (nbThrow === 3){
        displayLoser();
        displayBoss();
        displaySlotMachine();

        if (isEasterEggsDisplay()){
            //TODO
        }
    }
}

function displayLoser(){
    if (easterEggsRound === true) return;

    // Valeur du round = miss / miss / miss
    if (easterEggsIsRoundSameThrows('miss')){
        easterEggsRound = true;
        $('#easterEggsLoser').show().delay(3000).fadeOut("fast");
    }
}

function displaySlotMachine(){
    if (easterEggsRound === true) return;

    // Valeur du round = S7 / S7 / S7
    if (easterEggsIsRoundSameThrows('S7')){
        easterEggsRound = true;
        $('#easterEggsSlotMachine').show().delay(3000).fadeOut("fast");
    }
}

function displayBoss(){
    if (easterEggsRound === true) return;

    easterEggsRound = true;

    // Valeur du round = DBull / DBull / DBull
    if (easterEggsIsRoundSameThrows('D25'))
        $('#easterEggsBoss').show().delay(3000).fadeOut("fast");

    // Valeur du round = bull / bull / bull
    else if (easterEggsIsRoundSameThrows('S25'))
        $('#easterEggsLittleBoss').show().delay(3000).fadeOut("fast");

    // Valeur du round = que des bull
    else if (easterEggsIsRoundSameThrowsValue('S25'))
        $('#easterEggsBull').show().delay(3000).fadeOut("fast");
    else
        easterEggsRound = false;
}
// Fonction pour créer des confettis
function createConfetti() {
    // Nettoyer les anciens confettis
    $('.confetti').remove();

    // Créer 100 confettis avec différentes couleurs et positions
    const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5',
        '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50',
        '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722'];

    for (let i = 0; i < 100; i++) {
        const confetti = $('<div class="confetti"></div>');
        const color = colors[Math.floor(Math.random() * colors.length)];
        const left = Math.random() * 100;
        const width = Math.random() * 10 + 5;
        const height = Math.random() * 10 + 5;
        const delay = Math.random() * 3;
        const duration = Math.random() * 3 + 2;

        confetti.css({
            'background-color': color,
            'left': left + 'vw',
            'width': width + 'px',
            'height': height + 'px',
            'animation-delay': delay + 's',
            'animation-duration': duration + 's'
        });

        $('body').append(confetti);
    }
}


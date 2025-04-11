init01();

function init01(){
	arrayTouch.forEach((item, index) => {
		arrayTouch[index]['point'] = mode;
	});
	displayScore();
}

function manageThrow(dart, number, zone){
	let nb = determineNumberTouchs(zone);

	total = arrayTouch[selectedPlayer]['point'] - (nb*number);

	if(total < 0){
		displayModalChangePlayer()
	}else{
		arrayTouch[selectedPlayer]['point'] -= nb*number;
	}
	displayScore();
}

function displayScore(){
	displayHistoryRound();
	arrayTouch.forEach((hits, numPlayer) => {
		$('#scoreTotal'+numPlayer).html(hits['point']);
	});
	$("#scoreCurrentPlayer").html(arrayTouch[selectedPlayer]['point']);

	if(round >= 3){
		setHtmlHistoryRound(1,round, arrayRound[round][selectedPlayer]);
		setHtmlHistoryRound(2,round-1, arrayRound[round-1][selectedPlayer]);
		setHtmlHistoryRound(3,round-2, arrayRound[round-2][selectedPlayer]);
	}else if(round === 1){
		setHtmlHistoryRound(1,round, arrayRound[round][selectedPlayer]);
	}else if(round === 2){
		setHtmlHistoryRound(1,round, arrayRound[round][selectedPlayer]);
		setHtmlHistoryRound(2,round-1, arrayRound[round-1][selectedPlayer]);
	}
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
		}else{
			$('#throw'+i).removeClass('TripleShot').removeClass('DoubleShot').html('-');
		}
	}
}

function checkVictory(){
	let isVictory = true;

	if(arrayTouch[selectedPlayer]['point'] !== 0){
		isVictory = false;
	}
	if(round === maxRound && selectedPlayer === nombrePlayer && nbThrow === 3){

	}
	isGameOver = isVictory;

	return isVictory;
}

function displayVictoryScreen(){
	let lastPointPLayer = 1000;
	let winner = 1;
	arrayTouch.forEach((item, index) => {
		if(item['point'] < lastPointPLayer){
			lastPointPLayer = item['point'];
			winner = index;
		}
	});
	
	$('#zonevictory').show();
	$('#zonevictoryPlayer').html('Player '+winner);
	
	// Détermine le mode de jeu en fonction de la valeur initiale des points
	let gameMode = "01";
	if (mode === 301) gameMode = "301";
	else if (mode === 501) gameMode = "501";
	else if (mode === 701) gameMode = "701";
	
	// Sauvegarde des statistiques
	saveGameStats(winner, gameMode);

	setInterval(function(){
		isNewGame = true;
		$('#newGame').show();
		$('#zonebtnno').show();
		$('#zonebtyes').show();
	}, 1500);
}
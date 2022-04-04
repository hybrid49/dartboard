initGame(nombrePlayer);

function initGame(nbPLayer){
	for(let i = 1; i <= nbPLayer; i++){
		arrayTouch[i] = [];
	}
	arrayTouch.forEach((item, index) => {
		arrayTouch[index]['point'] = 0;
		arrayTouch[index]['nbThrowRound'] = 0;
		arrayTargets.forEach((v,i) => {
			arrayTouch[index][v] = 0;
		});
	});
}

function saveScore(score, dart, position){
	saveTouch(dart, position);
	calculateNewScore(score, dart);
}

function calculateNewScore(score, dart){
	let nb;

	if (arrayTouch[selectedPlayer][dart] > 3) {
		nb = arrayTouch[selectedPlayer][dart] - 3
		for (let i = 1; i <= nombrePlayer; i++) {
			if (i !== selectedPlayer) {
				if (arrayTouch[i][dart] < 3) {
					arrayTouch[i]['point'] = arrayTouch[i]['point'] + score * nb
				}
			}
		}
		arrayTouch[selectedPlayer][dart] = 3
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

			if (arrayTargets.includes(dart.toString()))
				$('#throw'+i).addClass(zoneText+'Shot');
				$('#tr'+dart).find('.tableChiffreCenter').html(dart.toString());
		}else{
			$('#throw'+i).removeClass('TripleShot').removeClass('DoubleShot').html('-');
		}
	}
}

function checkVictory(){
	let isVictory = true;

	if(!(round === maxRound && selectedPlayer === nombrePlayer && nbThrow === 3)){
		arrayTargets.forEach((v,i) => {
			if (arrayTouch[selectedPlayer][v] < 3)
				isVictory = false;
		});


		for(let i = 1; i <= nombrePlayer; i++){
			if (arrayTouch[selectedPlayer]["point"] > arrayTouch[i]["point"])
				isVictory = false;
		}
	}

	isGameOver = isVictory;

	return isVictory;
}

function displayScore(){
	arrayTouch.forEach((hits, numPlayer) => {
		hits.forEach((nbHit, target) => {
			$('#tr'+target).find('.tdPlayer'+numPlayer).html(getHtmlThrow(nbHit));
			$('#scoreTotal'+numPlayer).html(hits['point']);
		})
	});

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

function displayVictoryScreen(){
	let lastPointPLayer = 1000;
	let winner = 1;
	arrayTouch.forEach((item, index) => {
		if(item['point'] < lastPointPLayer){
			lastPointPLayer = item['point'];
			winner = index;
		}
	});
	if(winner === 1){
		r.style.setProperty('--main-bg-color', '#f44336');
		r.style.setProperty('--main-bg-color-darker', '#c62828');
		r.style.setProperty('--main-bg-color-darker-transparent', '#f4433663');
	}
	if(winner === 2){
		r.style.setProperty('--main-bg-color', '#fdd835');
		r.style.setProperty('--main-bg-color-darker', '#c7aa2b');
		r.style.setProperty('--main-bg-color-darker-transparent', '#fdd83563');
	}
	if(winner === 3){
		r.style.setProperty('--main-bg-color', '#2fc536');
		r.style.setProperty('--main-bg-color-darker', '#1d8122');
		r.style.setProperty('--main-bg-color-darker-transparent', '#2fc53663');
	}
	if(winner === 4){
		r.style.setProperty('--main-bg-color', '#03a9f4');
		r.style.setProperty('--main-bg-color-darker', '#016795');
		r.style.setProperty('--main-bg-color-darker-transparent', '#03a9f463');
	}
	$('#zonevictory').show();
	$('#zonevictoryPlayer').html('Player '+winner);

	setInterval(function(){
		isNewGame = true;
		$('#newGame').show();
		$('#zonebtnno').show();
		$('#zonebtyes').show();
	}, 1500);

}
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
	$('#zonevictory').show();
	$('#zonevictoryPlayer').html('Player '+winner);
	setInterval(function(){
		isNewGame = true;
		$('#zonevictory').hide();
		$('#newGame').show();
	}, 1500);

}
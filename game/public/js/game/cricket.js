initGame(nombrePlayer);

function getTextDart(zone){
	if(zone === "S"){
		return "Single";
	}else if(zone === "D"){
		return "Double";
	}else if(zone === "T") {
		return "Triple";
	}else{
		return "miss";
	}
}

function saveScore(score, dart, position){

	if(arrayTouch[selectedPlayer][dart] <= 3){
		if(position === 'T'){
			arrayTouch[selectedPlayer][dart] = arrayTouch[selectedPlayer][dart] + 3;
		}
		if(position === 'D'){
			arrayTouch[selectedPlayer][dart] = arrayTouch[selectedPlayer][dart] + 2;
		}
		if(position === 'S'){
			arrayTouch[selectedPlayer][dart] = arrayTouch[selectedPlayer][dart] + 1;
		}
	}
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

	displayScore()
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

function checkVictory(){
	if(round === maxRound && selectedPlayer === nombrePlayer && nbThrow === 3){
		isGameOver = true;
		return true;
	}
	let isVictory = true;
	arrayTargets.forEach((v,i) => {
		if (arrayTouch[selectedPlayer][v] < 3)
			isVictory = false;
	});


	for(let i = 1; i <= nombrePlayer; i++){
		if (arrayTouch[selectedPlayer]["point"] > arrayTouch[i]["point"])
			isVictory = false;
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
	setInterval(function(){
		isNewGame = true;
		$('#zonevictory').hide();
		$('#newGame').show();
	}, 1500);

}

function initGame(nbPLayer){
	for(let i = 1; i <= nbPLayer; i++){
		arrayTouch[i] = [];
	}
	arrayTouch.forEach((item, index) => {
		arrayTouch[index]['point'] = 0;
		arrayTargets.forEach((v,i) => {
			arrayTouch[index][v] = 0;
		});

	});
}
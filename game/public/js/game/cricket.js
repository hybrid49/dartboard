initCricket();

function initCricket(){
	arrayTouch.forEach((item, index) => {
		arrayTargets.forEach((v) => {
			arrayTouch[index][v] = 0;
		});
	});
}

function manageThrow(dart, number, zone){
	saveTouch(number, zone);
	calculateNewScore(number);
}

function saveTouch(dart, position){
	let numberTouch = determineNumberTouchs(position);
	arrayTouch[selectedPlayer][dart] += numberTouch;
}

function calculateNewScore(number){
	let nbTouch;

	if (arrayTouch[selectedPlayer][number] > 3) {
		nbTouch = arrayTouch[selectedPlayer][number] - 3
		for (let i = 1; i <= nombrePlayer; i++) {
			if (i !== selectedPlayer) {
				if (arrayTouch[i][number] < 3) {
					arrayTouch[i]['point'] += number * nbTouch
				}
			}
		}
		arrayTouch[selectedPlayer][number] = 3
	}
}

function checkVictory(button){
	let isVictory = true;

	if(!(round === maxRound && selectedPlayer === nombrePlayer &&
		(nbThrow === 3 || button === true))){
		arrayTargets.forEach((v) => {
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
	displayHistoryRound();

	if (round === 1 && nbThrow === 0 && nbTotalAction === 0)
		resetDisplayScore();
	else{
		arrayTouch.forEach((hits, numPlayer) => {
			hits.forEach((nbHit, target) => {
				$('#tr'+target).find('.tdPlayer'+numPlayer).html(getHtmlThrow(nbHit));
				$('#scoreTotal'+numPlayer).html(hits['point']);
			})
		});
	}
}

function resetDisplayScore(){
	for (let i = 0; i < nombrePlayer; i++) {
		arrayTargets.forEach((target) => {
			$('#tr'+target).find('.tdPlayer'+i).html(getHtmlThrow(0));
			$('#scoreTotal'+i).html(0);
		});
	}
}

function displayHistoryRound(){
	setHtmlHistoryRound(1,round, arrayRound[round][selectedPlayer]);

	if (round > 1)
		setHtmlHistoryRound(2,round-1, arrayRound[round-1][selectedPlayer]);

	if (round > 2)
		setHtmlHistoryRound(3,round-2, arrayRound[round-2][selectedPlayer]);
}

function displayVictoryScreen(){
	let winner = determineWinner();

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

function determineWinner(){
	let minPoint = 10000;
	let winner = 1;

	// TODO : prendre en compte le nombre de numéro fermé en cas d'égalité
	arrayTouch.forEach((item, index) => {
		if(item['point'] < minPoint) {
			minPoint = item['point'];
			winner = index;
		}else if (item['point'] === minPoint
			  && isCurrentPlayerHasBetterStatThanCurrentWinner(item, arrayTouch[winner]))
			winner = index;
	});

	return winner;
}
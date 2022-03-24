
let selectedPlayer = 1;
let round =1;
let r = document.querySelector(':root');
var socket = io();
let nbThrow = 0;
let lastMsg = '';
let arrayTouch = [];
let arrayRound = [];
initRound();
initGame(nombrePlayer);
socket.on('dart', function(msg) {
	throwDart(msg);
});

function throwDart(msg){
	if(lastMsg === ''){
		lastMsg = msg;
		if(msg === 'changePlayer'){
			changePlayer();
		}else{
			nbThrow++;
			if(nbThrow <= 3){
				playThrow(msg)
			}else{
				displayChangePlayer()
			}

		}
		setInterval(function(){
			lastMsg = '';
		}, 1500);
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
	if(nbThrow === 3){
		displayChangePlayer();
	}
}

function displayChangePlayer(){
	$('#changePlayer').show()
	displayScore()
}

function undoLastThrow(){
	if(nbThrow >= 1){
		let lastThrow = arrayRound[round][selectedPlayer][nbThrow];

	}
}

function saveDart(dart){
	if(dart.indexOf("S") >= 0){
		dart = dart.replace('S','');
		if(dart !== 'Bulle'){
			score = parseInt(dart);
			saveScore(score, dart,'S');
			$('#throw'+nbThrow).html('Single '+dart);
			$('#throw'+nbThrow).addClass('SingleShot');
		}else{
			score = 25;
			saveScore(score, dart,'S');
			$('#throw'+nbThrow).html('Single '+dart);
			$('#throw'+nbThrow).addClass('SingleShot');
		}
	}else if(dart.indexOf("D") >= 0){
		dart = dart.replace('D','');
		if(dart !== 'Bulle'){
			score = parseInt(dart);
			saveScore(score, dart, 'D');
			$('#throw'+nbThrow).html('Double '+dart);
			$('#throw'+nbThrow).addClass('DoubleShot');
		}else{
			score = 50;
			saveScore(score, dart, 'D');
			$('#throw'+nbThrow).html('Double '+dart);
			$('#throw'+nbThrow).addClass('DoubleShot');
		}
	}else if(dart.indexOf("T") >= 0){
		dart = dart.replace('T','');
		score = parseInt(dart);
		saveScore(score, dart, 'T');
		$('#throw'+nbThrow).html('Triple '+dart);
		$('#throw'+nbThrow).addClass('TripleShot');
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
	if(arrayTouch[selectedPlayer][dart] > 3){
		nb = arrayTouch[selectedPlayer][dart] - 3;
		for(let i = 1; i <= nombrePlayer; i++){
			if(i !== selectedPlayer){
				if(arrayTouch[i][dart] < 3){
					arrayTouch[i]['point'] = arrayTouch[i]['point'] + score*nb;
				}
			}
		}
		arrayTouch[selectedPlayer][dart] = 3;
	}

	displayScore()
}

function displayScore(){

	arrayTouch.forEach((item, index) => {
		item.forEach((i, v) => {
			if(i === 1){
				$('#tr'+v).find('.tdPlayer'+index).html(getHtmlThrow(i));
			}
			if(i === 2){
				$('#tr'+v).find('.tdPlayer'+index).html(getHtmlThrow(i));
			}
			if(i === 3){
				$('#tr'+v).find('.tdPlayer'+index).html(getHtmlThrow(i));
			}
			$('#scoreTotal'+index).html(item['point']);
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
	checkVictory();
}

function checkVictory(){

}

function setHtmlHistoryRound(idRound,numberRound, listeScore){
	let selectorHR1 = $('#HistoryRound'+idRound);
	selectorHR1.find('.T1').html('');
	selectorHR1.find('.T2').html('');
	selectorHR1.find('.T3').html('');
	selectorHR1.find('.title').html('R'+numberRound+' :');
	for(i=1;i<=3;i++){
		selectorHR1.find('.T'+i).html(getHtmlThrowLastRound(listeScore[i]));
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
	$('#throw1').removeClass('TripleShot');
	$('#throw1').removeClass('DoubleShot');
	$('#throw1').html('-');
	$('#throw2').removeClass('TripleShot');
	$('#throw2').removeClass('DoubleShot');
	$('#throw2').html('-');
	$('#throw3').removeClass('TripleShot');
	$('#throw3').removeClass('DoubleShot');
	$('#throw3').html('-');
	if(selectedPlayer == nombrePlayer){
		newRound()
	}else{
		selectedPlayer = selectedPlayer+1;
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

		$('.tdGame').removeClass('selected');
		$('.scorePlayer').removeClass('selected');
		$('.tdPlayer'+selectedPlayer).addClass('selected');
		$('#zoneScorePlayer'+selectedPlayer).addClass('selected');
	}
}

function newRound(){
	if(round === 20){
		displayVictoryScreen();
	}else{
		round = round + 1;
		initRound();
		selectedPlayer = 1
		r.style.setProperty('--main-bg-color', '#f44336');
		r.style.setProperty('--main-bg-color-darker', '#c62828');

		$('#nbRound').html(round);
		$('.tdGame').removeClass('selected');
		$('.scorePlayer').removeClass('selected');
		$('.tdPlayer'+selectedPlayer).addClass('selected');
		$('#zoneScorePlayer'+selectedPlayer).addClass('selected');
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
}

function initGame(nbPLayer){
	for(let i = 1; i <= nbPLayer; i++){
		arrayTouch[i] = [];
	}
	arrayTouch.forEach((item, index) => {
		arrayTouch[index]['20'] = 0;
		arrayTouch[index]['19'] = 0;
		arrayTouch[index]['18'] = 0;
		arrayTouch[index]['17'] = 0;
		arrayTouch[index]['16'] = 0;
		arrayTouch[index]['15'] = 0;
		arrayTouch[index]['Bulle'] = 0;
		arrayTouch[index]['point'] = 0;
	});
}
function initRound(){
	arrayRound[round] = []
	for(let i = 1; i <= nombrePlayer; i++){
		arrayRound[round][i] = [];
		arrayRound[round][i][1] = '';
		arrayRound[round][i][2] = '';
		arrayRound[round][i][3] = '';
	}
}

function getDart(msg){
	if(msg === '3,7'){
		return 'S20'
	}else if(msg === '2,7'){
		return 'D20'
	}else if(msg === '7,7'){
		return 'T20'
	}
	else if(msg === '0,1'){
		return 'S19'
	}else if(msg === '0,0'){
		return 'D19'
	}else if(msg === '0,2'){
		return 'T19'
	}
	else if(msg === '4,6'){
		return 'S18'
	}else if(msg === '1,6'){
		return 'D18'
	}else if(msg === '6,6'){
		return 'T18'
	}
	else if(msg === '1,4'){
		return 'S17'
	}else if(msg === '1,5'){
		return 'D17'
	}else if(msg === '1,3'){
		return 'T17'
	}
	else if(msg === '2,1'){
		return 'S16'
	}else if(msg === '2,0'){
		return 'D16'
	}else if(msg === '2,2'){
		return 'T16'
	}
	else if(msg === '3,4'){
		return 'S15'
	}else if(msg === '3,5'){
		return 'D15'
	}else if(msg === '3,3'){
		return 'T15'
	}
	else if(msg === '5,6'){
		return 'SBulle'
	}else if(msg === '5,7'){
		return 'DBulle'
	}
	else{
		return 'miss';
	}
}
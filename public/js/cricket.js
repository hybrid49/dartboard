
let selectedPlayer = 1;
let round =1;
let r = document.querySelector(':root');
const socket = io()
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
	let zone = dart.substring(0,1);
	let zoneText;

	if(zone === "S"){
		zoneText = "Single";
	}else if(zone === "D"){
		zoneText = "Double";
	}else if(zone === "T") {
		zoneText = "Triple";
	}

	dart = dart.replace(zone,'');
	score = parseInt(dart);
	saveScore(score, dart,zone);
	$('#throw'+nbThrow).html(zoneText+' '+dart);
	$('#throw'+nbThrow).addClass(zoneText+'Shot');
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
	for(let i=1;i<=3;i++){
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
	let selector1 = $('#throw1');
	let selector2 = $('#throw2');
	let selector3 = $('#throw3');
	selector1.removeClass('TripleShot');
	selector1.removeClass('DoubleShot');
	selector1.html('-');
	selector2.removeClass('TripleShot');
	selector2.removeClass('DoubleShot');
	selector2.html('-');
	selector3.removeClass('TripleShot');
	selector3.removeClass('DoubleShot');
	selector3.html('-');
	if(selectedPlayer === nombrePlayer){
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
	arrayRound[round] = [];
	for(let i = 1; i <= nombrePlayer; i++){
		arrayRound[round][i] = [];
		arrayRound[round][i][1] = '';
		arrayRound[round][i][2] = '';
		arrayRound[round][i][3] = '';
	}
}


function getDart(msg){
	arrayTouch.forEach((item, index) => {
		if (index===msg) {
			return item;
		}
	} );
}
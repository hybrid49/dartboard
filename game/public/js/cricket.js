
let selectedPlayer = 1;
let round =1;
let r = document.querySelector(':root');
const socket = io()
let nbThrow = 0;
let nbTotalThrow = 0;
let lastMsg = '';
let isGameOver = false;
let arrayTouch = [];
let arrayRound = [];
let arrayHistoryThrow = [];
let previousTimestamp = 0;

initRound();
initGame(nombrePlayer);

socket.on('arduino', function(msg) {
	arduinoEvent(msg);
});

function arduinoEvent(msg){
	let timestamp = Math.floor(Date.now());
	let deltaTimestamp = timestamp - previousTimestamp;

	if(msg !== '' && deltaTimestamp >= '900' && isGameOver === false ){

		previousTimestamp = timestamp;

		if(msg === 'btnValidate'){
			changePlayer();
		}else if(msg === 'btnCancel'){
			//ToDO : Mettre une pop-up de confirmation + Retour
		}else if (nbThrow < 3){
			//We don't trigger the function when players hit the board when they remove darts
			nbThrow++;
			nbTotalThrow++;
			playThrow(msg);
			saveHistory();
		}
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

	if (checkVictory()){
		displayVictoryScreen();
	}

	if(nbThrow === 3 && !checkVictory()){
		displayModalChangePlayer();
	}
	saveHistoryThrow();
}

function displayModalChangePlayer(){
	$('#changePlayer').show()
	displayScore()
}

function saveHistory(){
	if(nbTotalThrow >= 1){
		arrayHistoryThrow[nbTotalThrow] = $.extend(true, [], arrayTouch);
	}
}

function clone(obj){
	try{
		console.log(JSON.stringify(obj))
		var copy = JSON.parse(JSON.stringify(obj));
	} catch(ex){
		alert("Vous utilisez un vieux navigateur bien pourri, qui n'est pas pris en charge par ce site");
	}
	return copy;
}

function undoLastThrow(){
	$('#changePlayer').hide()

	if(nbThrow > 1){
		arrayRound[round][selectedPlayer][nbThrow] = '';
		nbThrow--;
	}else{
		arrayRound[round][selectedPlayer][nbThrow] = '';
		if(selectedPlayer != 1){
			nbThrow = 2;
			selectedPlayer--;
		}else{
			nbThrow = 2;
			round--;
			selectedPlayer = nombrePlayer;
		}
	}
	arrayHistoryThrow[nbTotalThrow] = [];

	nbTotalThrow--;
	arrayTouch = $.extend(true, [], arrayHistoryThrow[nbTotalThrow]);

	displayScore();
	displayChangedPlayer();
	displayHistoryRound();
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
				zoneText = getTextDart(zone);
				dart = arrayRound[round][selectedPlayer][i].replace(zone,'');
				(dart==="25") ? dartString = "Bull" : dartString = dart;
			}

			$('#throw'+i).html(zoneText+' '+dartString);
			$('#throw'+i).addClass(zoneText+'Shot');
		}else{
			$('#throw'+i).removeClass('TripleShot').removeClass('DoubleShot').html('-');
		}

	}
}

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

function saveDart(dart){
	let zone = dart.substring(0,1);

	dart = dart.replace(zone,'');
	displayHistoryRound();
	let score = parseInt(dart);
	saveScore(score, dart,zone);

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

function setHtmlHistoryRound(idRound,numberRound, listeScore){
	let selectorHR1 = $('#HistoryRound'+idRound);
	selectorHR1.find('.T1').html('');
	selectorHR1.find('.T2').html('');
	selectorHR1.find('.T3').html('');
	selectorHR1.find('.title').html('R'+numberRound+' :');
	for(let i=1;i<=3;i++){
		selectorHR1.find('.T'+i).html(getHtmlThrowLastRound(listeScore[i]));
		console.log();
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
	let dartInt = dart.substring(1);

	if (!(dartInt in arrayTouch[selectedPlayer])){
		return '-';
	}

	(dart==="25") ? dartString = "Bull" : dartString = dart;

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
	selector1.removeClass('TripleShot').removeClass('DoubleShot').html('-');
	selector2.removeClass('TripleShot').removeClass('DoubleShot').html('-');
	selector3.removeClass('TripleShot').removeClass('DoubleShot').html('-');

	if(selectedPlayer === nombrePlayer){
		newRound()
	}else{
		selectedPlayer = selectedPlayer+1;
		displayChangedPlayer();
	}

	displayScore();
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

function newRound(){
	if(round === 20){
		displayVictoryScreen();
	}else{
		round = round + 1;
		initRound();
		selectedPlayer = 1
		displayChangedPlayer();
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
		arrayTouch[index]['point'] = 0;
		arrayTargets.forEach((v,i) => {
			arrayTouch[index][v] = 0;
		});

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
	let result = targetMatrix[msg];
	if(result != undefined){
		return result;
	}else{
		return 'miss';
	}
}

function saveHistoryThrow(){

}
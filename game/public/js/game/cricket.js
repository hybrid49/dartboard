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

	if(!(round === maxRound && selectedPlayer === nombrePlayer && (nbThrow === 3 || button === true))){
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
	
	// Si nous avons des données de couleur pour le joueur gagnant, les utiliser
	if (typeof playerData !== 'undefined' && playerData[winner-1]) {
		const player = playerData[winner-1];
		r.style.setProperty('--main-bg-color', player.color);
		r.style.setProperty('--main-bg-color-darker', player.colorDarker);
		r.style.setProperty('--main-bg-color-darker-transparent', player.colorTransparent);
	} 
	// Sinon, utiliser les couleurs par défaut basées sur le numéro du joueur
	else {
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
	}
	
	// Récupérer le nom du joueur gagnant
	let winnerName = '';
	
	// Obtenir le nom depuis la zone d'affichage des scores
	const winnerNameElement = $('.zoneScorePlayer' + winner + ' .titlePlayer');
	if (winnerNameElement.length) {
		winnerName = winnerNameElement.text().trim();
	} else if (typeof playerNames !== 'undefined' && playerNames[winner-1]) {
		winnerName = playerNames[winner-1];
	} else {
		winnerName = 'Player ' + winner;
	}
	
	console.log("Joueur gagnant: ", winner, winnerName);
	
	// Créer des confettis pour la célébration
	createConfetti();
	
	// Mettre à jour le résumé des scores
	updateScoreSummary(winner);
	
	// Afficher l'écran de victoire avec animation en séquence
	$('#zonevictory').fadeIn(500, function() {
		// Animation du nom du gagnant
		$('#zonevictoryPlayer').html(winnerName).hide().fadeIn(500, function() {
			// Affichage du "Play again?"
			$('#newGame').fadeIn(500, function() {
				// Affichage des boutons YES/NO
				$('#zonebtnno, #zonebtyes').fadeIn(500);
			});
		});
	});
	
	// Collecter et préparer les statistiques spécifiques au mode cricket
	let customStats = {};
	arrayTouch.forEach((item, index) => {
		if (index > 0) {
			// Déterminer combien de cibles ont été fermées
			let closedTargets = 0;
			arrayTargets.forEach(target => {
				if (item[target] >= 3) closedTargets++;
			});
			
			customStats[index] = {
				closedTargets: closedTargets,
				totalClosedHits: 0
			};
			
			// Calculer les coups après fermeture (pour marquer des points)
			arrayTargets.forEach(target => {
				if (item[target] > 3) {
					customStats[index].totalClosedHits += (item[target] - 3);
				}
			});
		}
	});
	
	// Enregistrement des statistiques avec le mode Cricket et les statistiques personnalisées
	console.log("Sauvegarde des statistiques Cricket pour le gagnant:", winner, winnerName);
	saveGameStats(winner, "Cricket", customStats);

	// Définir l'état du jeu
	isNewGame = true;
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

function determineWinner(){
	let minPoint = 10000;
	let winner = 1;

	// TODO : prendre en compte le nombre de numéro fermé en cas d'égalité
	arrayTouch.forEach((item, index) => {
		if(item['point'] < minPoint) {
			minPoint = item['point'];
			winner = index;
		}else if (item['point'] === minPoint
			  && isCurrentPlayerBetterThanCurrentWinner(item, arrayTouch[winner]))
			winner = index;
	});

	return winner;
}

// Fonction pour mettre à jour le résumé des scores dans l'écran de victoire
function updateScoreSummary(winner) {
	let summaryHTML = '<div class="score-table">';
	
	// En-tête du tableau
	summaryHTML += '<div class="score-row header">';
	summaryHTML += '<div class="score-cell">Player</div>';
	summaryHTML += '<div class="score-cell">Points</div>';
	summaryHTML += '<div class="score-cell">Precision</div>';
	summaryHTML += '</div>';
	
	// Lignes pour chaque joueur
	for (let i = 1; i <= nombrePlayer; i++) {
		const isWinner = (i === winner);
		
		// Récupérer le nom du joueur à partir du DOM - utiliser différents sélecteurs possibles
		let playerName = '';
		
		// Tenter plusieurs sélecteurs pour trouver les noms
		// 1. D'abord avec l'ID zoneScorePlayer
		if ($('#zoneScorePlayer' + i + ' .titlePlayer').length) {
			playerName = $('#zoneScorePlayer' + i + ' .titlePlayer').text().trim();
		} 
		// 2. Ensuite avec la classe zoneScorePlayer
		else if ($('.zoneScorePlayer' + i + ' .titlePlayer').length) {
			playerName = $('.zoneScorePlayer' + i + ' .titlePlayer').text().trim();
		}
		// 3. Utiliser le tableau playerNames s'il est disponible
		else if (typeof playerNames !== 'undefined' && playerNames[i-1]) {
			playerName = playerNames[i-1];
		}
		// 4. Enfin, utiliser un nom de joueur par défaut
		else {
			playerName = 'Player ' + i;
		}
		
		// Filtrer les espaces supplémentaires ou les caractères superflus
		playerName = playerName.replace(/\s+/g, ' ').trim();
		
		console.log("Récupération du nom du joueur " + i + " (sélecteur ajusté):", playerName);
		
		const playerPoints = arrayTouch[i]['point'] || 0;
		
		// Calculer la précision
		const hits = arrayTouch[i]['nbHit'] || 0;
		const misses = arrayTouch[i]['nbMiss'] || 0;
		const totalThrows = hits + misses;
		const precision = totalThrows > 0 ? Math.round((hits / totalThrows) * 100) : 0;
		
		summaryHTML += '<div class="score-row ' + (isWinner ? 'winner' : '') + '">';
		summaryHTML += '<div class="score-cell">' + playerName + '</div>';
		summaryHTML += '<div class="score-cell">' + playerPoints + '</div>';
		summaryHTML += '<div class="score-cell">' + precision + '%</div>';
		summaryHTML += '</div>';
	}
	
	summaryHTML += '</div>';
	
	// Mettre à jour l'élément HTML
	$('.score-summary').html(summaryHTML);
}
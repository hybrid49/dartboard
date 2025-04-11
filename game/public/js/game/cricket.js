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
	// Si le joueur n'a pas plus de 3 touches, aucun calcul nécessaire
    if (arrayTouch[selectedPlayer][number] <= 3) {
        return;
    }

    // Calcul du nombre de touches excédentaires
    const nbTouch = arrayTouch[selectedPlayer][number] - 3;
    
    // Vérifie si au moins un autre joueur n'a pas fermé ce nombre
    const scoredAuthorized = Array.from({length: nombrePlayer}, (_, i) => i + 1)
        .some(i => i !== selectedPlayer && arrayTouch[i][number] < 3);

    // Attribution des points si autorisé
    if (scoredAuthorized) {
        arrayTouch[selectedPlayer]['point'] += number * nbTouch;
    }

    // Limite le nombre de touches à 3
    arrayTouch[selectedPlayer][number] = 3;
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


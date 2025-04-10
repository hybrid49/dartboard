// Rules of Play:
// Avoir le plus d'or à la fin des 10 tours
// Chaque joueur commence avec 3 d'or et 181 points
// Lorsqu'un joueur atteint 0 tout pile, il redémarre à 181 et gagne 3 d'or
// S'il dépasse 0, le surplus est le nouveau score à atteindre (ex : 5, flechette sur 12, à faire: 7)
// Lorsqu'un jour atteint le score exact d'un autre joueur, il lui vole 1 or et ce joueur perd la moitié de ses points
//    (ex : 13 (donc 168 points de fait) -> 97 car 168/2=84 et 84+13 =97)
let pointBeforeTreasure = 181;

initGoldHunting();

function initGoldHunting(){
    arrayTouch.forEach((item, index) => {
        arrayTouch[index]['point'] = pointBeforeTreasure;
        arrayTouch[index]['gold'] = 3;
        arrayTouch[index]['treasure'] = 0;
        arrayTouch[index]['steal'] = 0;
        arrayTouch[index]['stole'] = 0;
    });
    
    // Initialiser les deux jauges centrales (commencent pleines)
    updateBothGauges(pointBeforeTreasure);
    
    updateDisplay();
}

function updateDisplay() {
    // Mettre à jour le score cible actuel
    $('#currentTargetScore').text(arrayTouch[selectedPlayer]['point']);
    
    // Mettre à jour les scores d'or pour tous les joueurs
    for(let i = 1; i <= nombrePlayer; i++) {
        $('#goldScore' + i).text(arrayTouch[i]['gold']);
        // Mettre à jour les scores dans les tableaux
        $('#scoreTotal' + i).text(arrayTouch[i]['point']);
    }
    
    // Mettre à jour les jauges centrales avec le score du joueur actif
    updateBothGauges(arrayTouch[selectedPlayer]['point']);
    
    // Mettre en évidence le joueur actuel
    $('.playerScoreCard').removeClass('selected');
    $('#zoneScorePlayer' + selectedPlayer).addClass('selected');
    
    // Mettre en évidence le nom du joueur actif
    $('.player-name').removeClass('active');
    $('.player-name[data-player="' + selectedPlayer + '"]').addClass('active');
}

function displayScore(){
	
}

//
function displayHistoryRound(){
	
}
//TODO: checkVictory
function checkVictory(button){
	
}

// Fonction pour mettre à jour les deux jauges centrales
function updateBothGauges(currentScore) {
    // Mettre à jour la première jauge
    updateCentralGauge('1', currentScore);
    
    // Mettre à jour la deuxième jauge
    updateCentralGauge('2', currentScore);
}

// Fonction pour mettre à jour une jauge centrale spécifique
function updateCentralGauge(gaugeNumber, currentScore) {
    const maxScore = pointBeforeTreasure;
    const minScore = 0;
    
    // Calculer le pourcentage de vidage pour la jauge (100% = vide, 0% = plein)
    let emptyPercentage = ((maxScore - currentScore) / maxScore) * 100;
    
    // Limiter le pourcentage entre 0 et 100
    emptyPercentage = Math.max(0, Math.min(100, emptyPercentage));
    
    // Mettre à jour la jauge pour qu'elle se vide par le haut
    let remainingPercentage = 100 - emptyPercentage;
    
    // Mettre à jour la hauteur de la jauge et déplacer son point de départ
    $('#centralGauge' + gaugeNumber).css({
        'height': remainingPercentage + '%',
        'bottom': '0',
        'top': 'auto'
    });
    
    // Mettre à jour la valeur affichée
    $('#centralGaugeValue' + gaugeNumber).text(currentScore);
    
    // Mettre à jour l'attribut data-score
    $('#centralGauge' + gaugeNumber).attr('data-score', currentScore);
}

// Ancienne fonction non utilisée
function updatePlayerGauge(playerIndex, currentScore) {
    // Cette fonction n'est plus utilisée mais reste au cas où on voudrait revenir aux jauges individuelles
}

function manageThrow(dart, number, zone){
    let throwPoint = number * determineNumberTouchs(zone);

    if (arrayTouch[selectedPlayer]['point'] === throwPoint){
        foundTreasure();
    }else if (arrayTouch[selectedPlayer]['point'] < throwPoint){
        bust(throwPoint);
    }else{
        manageSteal();
        arrayTouch[selectedPlayer]['point'] -= throwPoint;
    }
    
    updateDisplay();
}

function foundTreasure(){
    arrayTouch[selectedPlayer]['point'] = pointBeforeTreasure;
    arrayTouch[selectedPlayer]['gold'] += 3;
    arrayTouch[selectedPlayer]['treasure']++;
    
    // Afficher l'animation ou notification de trésor trouvé
    showNotification("TREASURE FOUND!");
}

function showNotification(message) {
    // Créer un élément de notification temporaire
    let $notification = $('<div class="gameNotification">' + message + '</div>');
    $('body').append($notification);
    
    // Afficher puis cacher après un délai
    $notification.fadeIn(300).delay(1500).fadeOut(300, function() {
        $(this).remove();
    });
}

function bust(throwPoint){
    arrayTouch[selectedPlayer]['point'] = throwPoint - arrayTouch[selectedPlayer]['point'];
    
    // Afficher la notification de dépassement
    showNotification("BUST!");
}

function manageSteal(){
    for (let i = 1; i <= nombrePlayer && i !== selectedPlayer; i++) {
        if (arrayTouch[i]['point'] === arrayTouch[selectedPlayer]['point']){
            stealGold(i);
            stolenCowboyLosePoints(i);
        }
    }
}

function stealGold(stoleCowboy){
    if (arrayTouch[stoleCowboy]['gold'] !== 0){
        arrayTouch[selectedPlayer]['gold']++;
        arrayTouch[stoleCowboy]['gold']--;
        statSteal(stoleCowboy);
        
        // Afficher la notification de vol d'or
        showNotification("GOLD STOLEN FROM PLAYER " + stoleCowboy + "!");
    }else {
        showNotification("PLAYER " + stoleCowboy + " HAS NO GOLD!");
    }
}

function statSteal(stoleCowboy){
    arrayTouch[selectedPlayer]['steal']++;
    arrayTouch[stoleCowboy]['stole']++;
}

function stolenCowboyLosePoints(stolenCowboy){
    if (arrayTouch[stolenCowboy]['point'] !== pointBeforeTreasure){
        let currentPoint = pointBeforeTreasure - arrayTouch[stolenCowboy]['point'];
        let lostPoint = Math.ceil(currentPoint / 2);

        arrayTouch[stolenCowboy]['point'] += lostPoint;
    }
    
    // Mettre à jour l'affichage après les changements
    updateDisplay();
}

function displayVictoryScreen(){
    let winner = determineWinner();

    $('#zonevictory').show();
    $('#zonevictoryPlayer').html('Player ' + winner);
    $('#zonebtnno').show();
    $('#zonebtyes').show();
}

function determineWinner(){
    let maxGold = 1;
    let winner = 1;

    arrayTouch.forEach((item, index) => {
        if(index === 0) return; // Ignorer l'index 0 qui n'est pas un joueur
        
        if(item['gold'] > maxGold) {
            maxGold = item['gold'];
            winner = index;
        }else if (item['gold'] === maxGold){
            switch(isCurrentCowboyhasBetterStatThanCurrentWinner(item, arrayTouch[winner])) {
                case true:
                    winner = index;
                    break;
                case null:
                    if (isCurrentPlayerHasBetterStatThanCurrentWinner(item, arrayTouch[winner]))
                        winner = index;
                    break;
            }
        }
    });

    return winner;
}

function isCurrentCowboyhasBetterStatThanCurrentWinner(currentCowboy, currentWinner){
    // Note: In this game, the points decrease, so the player with less points scored the most points
    if (currentCowboy['point'] > currentWinner['point'])
        return true;
    else if(currentCowboy['point'] === currentWinner['point']){
        if (currentCowboy['treasure'] > currentWinner['treasure'])
            return true;
        else if(currentCowboy['treasure'] === currentWinner['treasure']){
            if (currentCowboy['steal'] > currentWinner['steal'])
                return true;
            else if(currentCowboy['steal'] === currentWinner['steal'])
                return null;
            else
                return false;
        }
    }
    return false;
}

// Fonction pour changer de joueur
function changePlayer() {
    selectedPlayer = (selectedPlayer % nombrePlayer) + 1;
    updateDisplay();
    $('#changePlayer').show().delay(1500).fadeOut(300);
}

// Écouteurs d'événements pour les interactions utilisateur
$(document).ready(function() {
    // Ajouter le CSS pour la notification
    $('<style>.gameNotification { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background-color: rgba(0,0,0,0.8); color: white; padding: 20px; font-size: 30px; border-radius: 10px; z-index: 1000; display: none; }</style>').appendTo('head');
    
    // Écouteur pour le clic sur "YES" pour rejouer
    $('#zonebtyes').on('click', function() {
        // Réinitialiser le jeu
        initGoldHunting();
        $('#zonevictory, #zonebtnno, #zonebtyes').hide();
    });
    
    // Écouteur pour le clic sur "NO" pour quitter
    $('#zonebtnno').on('click', function() {
        $('#returnMenu').show();
        $('#zonevictory, #zonebtnno, #zonebtyes').hide();
    });
});

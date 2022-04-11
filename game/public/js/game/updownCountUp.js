// Rules of Play:
// Avoir les plus de points à la fin des 8 tours
// Lors des tours paires, le joueur gagne des points
// Lors des tours impairs, il perd des points
//   A noter que durant les tours impairs, 1 miss fait perdre 50 points
function manageThrow(dart, number, zone){
    let sign = (round % 2 === 0) ? -1 : 1;
    let numberTouch = determineNumberTouchs(zone);

    arrayTouch[selectedPlayer]['point'] += sign * numberTouch * number;
}

function exitPlayThrowMiss(){
    if (round % 2 === 0)
        arrayTouch[selectedPlayer]['point'] -= 50;
}

function displayScore(){
    $('#scoreTotal'+selectedPlayer).html(arrayTouch[selectedPlayer]['point']);

    // TODO : Historique des 8 derniers tours
}

function displayVictoryScreen(){
    let winner = determineWinner();

    $('#zonevictory').show();
    $('#zonevictoryPlayer').html('Player '+winner);
}

function determineWinner(){
    let maxPoint = 1;
    let winner = 1;

    arrayTouch.forEach((item, index) => {
        if(item['point'] > maxPoint) {
            maxPoint = item['point'];
            winner = index;
        }else if (item['point'] === maxPoint
            && isCurrentPlayerHasBetterStatThanCurrentWinner(item, arrayTouch[winner]))
            winner = index;
    });

    return winner;
}
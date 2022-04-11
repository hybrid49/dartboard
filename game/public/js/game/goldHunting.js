// Rules of Play:
// Avoir le plus d'or à la fin des 10 tours
// Chaque joueur commence avec 3 d'or et 181 points
// Lorsqu'un joueur atteint 0 tout pile, il redémarre à 181 et gagne 3 d'or
// S'il dépasse 0, le surplus est le nouveau score à atteindre (ex : 5, flechette sur 12, à faire: 7)
// Lorsqu'un jour atteint le score exact d'un autre joueur, il lui vole 1 or et ce joueur perd la moitié de ses points
//    (ex : 13 (donc 168 points de fait) -> 97 car 168/2=84 et 84+13 =97)
initGoldHunting( );

function initGoldHunting(){
    arrayTouch.forEach((item, index) => {
        arrayTouch[index]['gold'] = 3;
        arrayTouch[index]['point'] = 181;
    });
}

function manageThrow(dart, number, zone){
    //A closed area does not earn points.
    if (!arrayHitted.includes(number)){
        let numberTouch = determineNumberTouchs(zone);
        let multiplier = ((arrayMultiplier.includes(number)) ? manageHittedMultiplier(number, numberTouch) : 1);

        arrayTouch[selectedPlayer]['point'] += multiplier * numberTouch * number;
    }
}

function manageHittedMultiplier(number, numberTouch){
    let multiplier = arrayTouch[selectedPlayer]['multiplier'];
    arrayTouch[selectedPlayer]['multiplier']++;
    arrayHitted.push(number);

    determineNewMultiplierZone(numberTouch);

    return multiplier;
}

function determineNewMultiplierZone(numberTouch){
    let number = arrayMultiplier.slice(-1);

    for (let i = 0; i < numberTouch; i++) {
        number++;
        arrayHitted.push(number);
    }
}

function displayScore(){
    $('#scoreTotal'+selectedPlayer).html(arrayTouch[selectedPlayer]['point']);
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
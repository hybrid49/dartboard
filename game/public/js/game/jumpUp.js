// Rules of Play:
// Chaque joueur commence avec 0 point, un multiplicateur de 1 et les zones 1, 2 et 3 comme
//      zone permettant d'améliorer son multiplicateur
// Dès qu'un joueur touche une de ces zones, il augmente son multiplicateur de 1 et il
//      ajoute 1/2/3 zones dans ses zones à toucher selon s'il a fait un simple/double/triple
//      tout en enlevant la zone qu'il vient d'atteindre
// (ex: première fleche T1 : zone à toucher = 2/3/4/5/6 (ajout de trois zones)
//                           multiplicateur = 2)
//      Lorsqu'il atteint une de ces zones, les points qu'il devait avoir sont multipliés
//      par le multiplicateur (avant son amélioration)
//  Une fois une de ces zones atteinte, elle ne vaut plus de point pour le reste de la partie
//  La bulle vaut 50 points
let arrayMultiplier = [];
let arrayHitted = [];

initJumpUp( );

function initJumpUp(){
    arrayTouch.forEach((item, index) => {
        arrayTouch[index]['multiplier'] = 1;
    });

    for(let i = 1; i <= nombrePlayer; i++)
        arrayMultiplier[i] = ["1","2","3"];
        arrayHitted[i] = [];
}

function manageThrow(dart, number, zone){
    //A closed area does not earn points.
    if (!arrayHitted.includes(number)){
        let numberTouch = (number === "25") ? 2 : determineNumberTouchs(zone); //We force the bubble to 50 points
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

    if (number.toString() !== "25"){
        for (let i = 0; i < numberTouch && number.toString() !== "25"; i++) {
            number++;

            if (number.toString() === "21")
                number = "25";
            arrayMultiplier.push(number);
        }
    }
}

function checkVictory(button){
    //button is useless in this game
    return (round === maxRound);
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
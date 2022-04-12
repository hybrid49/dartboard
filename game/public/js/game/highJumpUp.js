// Rules of Play:
// Même principe que Jump Up sauf qu'on commence avec 5 zones et que le multiplicateur augmente de la
//    même façon que le nombre de zone
//    (un triple d'une zone à toucher : 3 nouvelles zones & +3 de multiplicateur)
// Lorsque la bulle fait partie des zones à toucher, elle y reste et elle ne vaut pas 50 points mais
//    le double du score actuel du joueur
// Si le joueur touche avec ses 3 flechettes des zones à amélioration de multiplicateur, il gagne
//    un combo pour son dernier lancé qui fait multiplier par 3 le score de ce lancer
//(ex : un joueur à 2455 points et touché 2 fois des zones cibles, et il touche la bulle sur
//      la 3ème qui fait aussi partie des zones cibles, dans ce cas il gagne 2455*3 pour ce lancer
//      il passe donc à 9820 points)
// De plus une ancienne zone a ciblée marque les points habituels
let arrayMultiplier = [];
let arrayHitted = [];

initHighJumpUp( );

function initHighJumpUp(){
    arrayTouch.forEach((item, index) => {
        arrayTouch[index]['multiplier'] = 1;
        // Round data
        arrayTouch[index]['nbMultiplierRound'] = 0;
        // End game data
        arrayTouch[index]['combo'] = 0;
    });

    for(let i = 1; i <= nombrePlayer; i++)
        arrayMultiplier[i] = ["1","2","3","4","5"];
        arrayHitted[i] = [];
}

function manageThrow(dart, number, zone){
    let numberTouch = determineNumberTouchs(zone);
    let multiplier  = 1;

    if ((arrayMultiplier.includes(number)) && !(arrayHitted.includes(number))){
        if (number === "25") {
            numberTouch = 1;
            number = arrayTouch[selectedPlayer]['point'];
        }
        multiplier = manageHittedMultiplier(number, numberTouch);
    }else if (number === "25")
        numberTouch = 2;

    arrayTouch[selectedPlayer]['point'] += multiplier * numberTouch * number;
}

function manageHittedMultiplier(number, numberTouch){
    let currentMultiplier = (number === "25") ? 1 : arrayTouch[selectedPlayer]['multiplier'];
    let combo = determineCombo();

    calculateNewMultiplier(numberTouch);
    determineNewMultiplierZone(numberTouch);
    determineHittedMultiplierZone(number);

    return currentMultiplier * combo;
}

function determineCombo(){
    arrayTouch[selectedPlayer]['nbMultiplierRound']++;

    return (arrayTouch[selectedPlayer]['nbMultiplierRound'] === 3) ? 3 : 1;
}

function calculateNewMultiplier(numberTouch){
    arrayTouch[selectedPlayer]['multiplier'] += numberTouch;
    arrayTouch[selectedPlayer]['nbMultiplierRound']++;
}

function determineNewMultiplierZone(numberTouch){
    let number = arrayMultiplier.slice(-1);

    if (number.toString() !== "25"){
        for (let i = 0; i < numberTouch && number.toString() < "21"; i++) {
            number++;

            if (number.toString() === "21")
                number = "25";
            arrayMultiplier.push(number);
        }
    }
}

function determineHittedMultiplierZone(number){
    if (number !== "25")
        arrayMultiplier.push(number);
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
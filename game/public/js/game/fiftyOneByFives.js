// Rules of Play:
// The total points for each turn must be divisible by five to receive any score.
// The score for each turn is determined by the number of fives hit.
// For example, if a player gets 20 points on a turn, the score is 4
//     because 20 divided by 5 is 4. If a score for an entire turn is not
//     divisible by 5, it is not counted.
// All numbers on the board are used, including triples, doubles and bulls.
// The winner is the first player to score fifty-one fives and all three darts
//     must score on the last turn.
let currentScore = 0;

initFiftyOneByFives( );

function initFiftyOneByFives(){
    arrayTouch.forEach((item, index) => {
        arrayTouch[index]['fivesNumber'] = 0;
    });
}

function manageThrow(dart, score, zone){
    let numberTouch = determineNumberTouchs(zone);

    currentScore += score * numberTouch;
    arrayTouch[selectedPlayer]['nbThrowRound'] = nbThrow;

    if (nbThrow === 3){
        if (currentScore < previousScore){
            arrayTouch[selectedPlayer]['nbLeg'] --;

            if (arrayTouch[selectedPlayer]['nbLeg'] > 0)
            //TODO : Mettre pop-up de perte d'une jambe
            else
            //TODO : Mettre pop-up d'élimination
        }
        previousScore = currentScore;
        currentScore = 0;
    }
}
// Rules of Play:
// Avoir le plus d'or à la fin des 10 tours
// Chaque joueur commence avec 3 d'or et 181 points
// Lorsqu'un joueur atteint 0 tout pile, il redémarre à 181 et gagne 3 d'or
// S'il dépasse 0, le surplus est le nouveau score à atteindre (ex : 5, flechette sur 12, à faire: 7)
// Lorsqu'un jour atteint le score exact d'un autre joueur, il lui vole 1 or et ce joueur perd la moitié de ses points
//    (ex : 13 (donc 168 points de fait) -> 97 car 168/2=84 et 84+13 =97)
let pointBeforeTreasure = 181;

initGoldHunting( );

function initGoldHunting(){
    arrayTouch.forEach((item, index) => {
        arrayTouch[index]['point'] = pointBeforeTreasure;
        arrayTouch[index]['gold'] = 3;
        arrayTouch[index]['treasure'] = 0;
        arrayTouch[index]['steal'] = 0;
        arrayTouch[index]['stole'] = 0;
    });
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
}

function foundTreasure(){
    arrayTouch[selectedPlayer]['point'] = pointBeforeTreasure;
    arrayTouch[selectedPlayer]['gold'] += 3;
    arrayTouch[selectedPlayer]['treasure']++;
}

function bust(throwPoint){
    arrayTouch[selectedPlayer]['point'] = throwPoint - arrayTouch[selectedPlayer]['point'];

    displayBust();
}

function displayBust(){
    $('#trBust').find('.tdPlayer'+selectedPlayer).html();
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
    }else {
        displayPoverty();
        /*TODO : Easter eggs : si un joueur fait la bulle après avoir tenté de voler
        une personne à 0 Gold (et donc récupéré 0) pendant le même tour, afficher
        une banque et mettre cette personne à -1 (et donc gagner 1 gold)*/
    }
}

function statSteal(stoleCowboy){
    arrayTouch[selectedPlayer]['steal']++;
    arrayTouch[stoleCowboy]['stole']++;
}

function displayPoverty(){
    $("#poverty").show().delay(2000).fadeOut("fast");
}

function stolenCowboyLosePoints(stolenCowboy){
    if (arrayTouch[stolenCowboy]['point'] !== pointBeforeTreasure){
        let currentPoint = pointBeforeTreasure - arrayTouch[stolenCowboy]['point'];
        let lostPoint = Math.ceil(currentPoint / 2);

        arrayTouch[stolenCowboy]['point'] += lostPoint;
    }
}

function displayScore(){
    for(let i = 1; i <= nombrePlayer; i++){
        displayGold(i);

        if (i === selectedPlayer)
            $('#trPoint').find('.tdPlayer'+i).html(arrayTouch[i]['point']);
        else
            displayCatchUp(i);
    }
}

function displayGold(numPlayer){
    $('#trGold').find('.tdPlayer'+numPlayer).html(arrayTouch[numPlayer]['gold']);
}

function displayCatchUp(enemyCowboy){
    let numberToCatch = arrayTouch[selectedPlayer]['point'] - arrayTouch[enemyCowboy]['point'];

    if (numberToCatch > 0){
        $('#trCatchUp').find('.tdPlayer'+enemyCowboy).html();
        $('#trPoint').find('.tdPlayer'+enemyCowboy).html(numberToCatch);
    }else
        $('#trPoint').find('.tdPlayer'+enemyCowboy).html('-');
}

function displayVictoryScreen(){
    let winner = determineWinner();

    $('#zonevictory').show();
    $('#zonevictoryPlayer').html('Player '+winner);
}

function determineWinner(){
    let maxGold = 1;
    let winner = 1;

    arrayTouch.forEach((item, index) => {
        if(item['gold'] > maxGold) {
            maxGold = item['gold'];
            winner = index;
        }else if (item['gold'] === maxGold);
            switch(isCurrentCowboyBetterThanWinner(item, arrayTouch[winner])) {
                case true:
                    winner = index;
                    break;
                case null:
                    if (isCurrentCowboyBetterThanWinner(item, arrayTouch[winner]))
                        winner = index;
                    break;
            }
    });

    return winner;
}

function isCurrentCowboyBetterThanWinner(currentCowboy, winner){
    // Note: In this game, the points decrease, so the player with less points scored the most points
    if (currentCowboy.point > currentCowboy.point)
    // if (currentCowboy['point'] > winner['point'])
        return true;

    if(currentCowboy['point'] === winner['point']){
        if (currentCowboy['treasure'] > winner['treasure'])
            return true;

        if(currentCowboy['treasure'] === winner['treasure']){
            if (currentCowboy['steal'] > winner['steal'])
                return true;
            else if(currentCowboy['steal'] === winner['steal'])
                return null;
            else
                return  false;
        }
    }
}
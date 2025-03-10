export function initGame(nombrePlayer, arrayTouch, arrayHistoryThrow, nbTotalAction) {
    for (let i = 1; i <= nombrePlayer; i++)
        arrayTouch[i] = [];

    arrayTouch.forEach((item, index) => {
        arrayTouch[index]['point'] = 0;
        arrayTouch[index]['nbThrowRound'] = 0;
        // End game stat
        arrayTouch[index]['nbHit'] = 0;
        arrayTouch[index]['nbMiss'] = 0;
        arrayTouch[index]['nbSingle'] = 0;
        arrayTouch[index]['nbDouble'] = 0;
        arrayTouch[index]['nbTriple'] = 0;
        arrayTouch[index]['nbBull'] = 0;
        arrayTouch[index]['nbDoubleBull'] = 0;
    });

    arrayHistoryThrow[nbTotalAction] = $.extend(true, [], arrayTouch);
}

export function initRound(round, nombrePlayer, arrayRound) {
    arrayRound[round] = [];
    for (let i = 1; i <= nombrePlayer; i++) {
        arrayRound[round][i] = [];
        arrayRound[round][i][1] = '';
        arrayRound[round][i][2] = '';
        arrayRound[round][i][3] = '';
        arrayRound[round][i]['point'] = 0;
    }
}
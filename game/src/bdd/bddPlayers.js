const express = require('express');
const csvdb = require("csv-database");

async function getPlayers() {
    try {
        const bddPlayer= await csvdb("src/bdd/players.csv", ["id", "name", "nbgames", "nbhit", "nbthrow", "nbtriple", "nbdouble", "nbbull"]);
        return bddPlayer.get();
    } catch (error) {
        console.error("Erreur lors du chargement des joueurs :", error);
    }
}

async function addPlayers(playerName) {
    try {
        const bddPlayer = await csvdb("src/bdd/players.csv", ["id", "name", "nbgames", "nbhit", "nbthrow", "nbtriple", "nbdouble", "nbbull"]);
        players = getPlayers();
        bddPlayer.add({id: (await players).length, name: playerName, nbgames: 0, nbhit: 0, nbthrow: 0, nbtriple: 0, nbdouble: 0, nbbull: 0});
    } catch (error) {
        console.error("Erreur lors de l\'ajout du joueur :", error);
    }
}


async function deletePlayer(playerId) {
    try {
        const bddPlayer = await csvdb("src/bdd/players.csv", ["id", "name", "nbgames", "nbhit", "nbthrow", "nbtriple", "nbdouble", "nbbull"]);
        bddPlayer.delete({name: playerId});
        console.log(playerId);
    } catch (error) {
        console.error("Erreur lors de l\'ajout du joueur :", error);
    }
}

module.exports = {
    addPlayers,
    getPlayers,
    deletePlayer
};

const express = require('express');
const csvdb = require("csv-database");

async function getGames() {
    try {
        const bddPlayer= await csvdb("src/bdd/games.csv", ["id", "name", "date", "players", "stats"]);
        return bddPlayer.get();
    } catch (error) {
        console.error("Erreur lors du chargement des joueurs :", error);
    }
}

async function addGame(arrayGame) {
    try {
        const bddPlayer = await csvdb("src/bdd/games.csv", ["id", "name", "date", "players", "stats"]);
        players = getPlayers();
    } catch (error) {
        console.error("Erreur lors de l\'ajout du joueur :", error);
    }
}


async function deleteGame(playerId) {
    try {
        const bddPlayer = await csvdb("src/bdd/games.csv", ["id", "name", "date", "players", "stats"]);
        bddPlayer.delete({name: playerId});
        console.log(playerId);
    } catch (error) {
        console.error("Erreur lors de l\'ajout du joueur :", error);
    }
}

module.exports = {
    getGames,
    addGame,
    deleteGame
};

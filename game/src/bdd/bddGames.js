const express = require('express');
const csvdb = require("csv-database");

async function getGames() {
    try {
        const bddGames = await csvdb("src/bdd/games.csv", ["id", "type", "date", "winner", "players", "stats"]);
        return bddGames.get();
    } catch (error) {
        console.error("Erreur lors du chargement des parties :", error);
        return [];
    }
}

async function addGame(gameData) {
    try {
        const bddGames = await csvdb("src/bdd/games.csv", ["id", "type", "date", "winner", "players", "stats"]);
        const games = await getGames();
        
        // Génération d'un nouvel ID
        const newId = games.length > 0 ? Math.max(...games.map(game => parseInt(game.id))) + 1 : 0;
        
        // Formatage de la date actuelle
        const now = new Date();
        const formattedDate = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        
        // Création de l'entrée dans la base de données
        await bddGames.add({
            id: newId,
            type: gameData.type || "cricket",
            date: formattedDate,
            winner: gameData.winner || "",
            players: gameData.players || "",
            stats: gameData.stats || ""
        });
        
        return true;
    } catch (error) {
        console.error("Erreur lors de l'ajout de la partie :", error);
        return false;
    }
}

async function deleteGame(gameId) {
    try {
        const bddGames = await csvdb("src/bdd/games.csv", ["id", "type", "date", "winner", "players", "stats"]);
        await bddGames.delete({id: gameId});
        return true;
    } catch (error) {
        console.error("Erreur lors de la suppression de la partie :", error);
        return false;
    }
}

module.exports = {
    getGames,
    addGame,
    deleteGame
};

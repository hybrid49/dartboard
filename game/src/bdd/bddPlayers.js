const express = require('express');
const csvdb = require("csv-database");
const path = require('path');

// Définir le chemin absolu vers le fichier CSV
const PLAYERS_CSV_PATH = path.resolve(__dirname, './players.csv');

async function getPlayers() {
    try {
        const bddPlayer = await csvdb(PLAYERS_CSV_PATH, ["id", "name", "nbgames", "nbhit", "nbthrow", "nbtriple", "nbdouble", "nbbull"]);
        return bddPlayer.get();
    } catch (error) {
        console.error("Erreur lors du chargement des joueurs :", error);
        console.error("Chemin du fichier:", PLAYERS_CSV_PATH);
        return [];
    }
}

async function addPlayers(playerName) {
    try {
        const bddPlayer = await csvdb(PLAYERS_CSV_PATH, ["id", "name", "nbgames", "nbhit", "nbthrow", "nbtriple", "nbdouble", "nbbull"]);
        players = await getPlayers();
        await bddPlayer.add({id: players.length, name: playerName, nbgames: 0, nbhit: 0, nbthrow: 0, nbtriple: 0, nbdouble: 0, nbbull: 0});
        console.log(`Joueur ajouté: ${playerName}`);
    } catch (error) {
        console.error("Erreur lors de l'ajout du joueur:", error);
        console.error("Chemin du fichier:", PLAYERS_CSV_PATH);
    }
}

async function deletePlayer(playerId) {
    try {
        const bddPlayer = await csvdb(PLAYERS_CSV_PATH, ["id", "name", "nbgames", "nbhit", "nbthrow", "nbtriple", "nbdouble", "nbbull"]);
        await bddPlayer.delete({name: playerId});
        console.log(`Joueur supprimé: ${playerId}`);
    } catch (error) {
        console.error("Erreur lors de la suppression du joueur:", error);
        console.error("Chemin du fichier:", PLAYERS_CSV_PATH);
    }
}

/**
 * Met à jour les statistiques d'un joueur existant
 * @param {string} playerName - Nom du joueur à mettre à jour
 * @param {object} stats - Statistiques à mettre à jour
 * @returns {boolean} - Succès ou échec de la mise à jour
 */
async function updatePlayerStats(playerName, stats) {
    console.log(`Tentative de mise à jour des stats pour ${playerName} avec:`, stats);
    
    try {
        // Charger la base de données
        const bddPlayer = await csvdb(PLAYERS_CSV_PATH, ["id", "name", "nbgames", "nbhit", "nbthrow", "nbtriple", "nbdouble", "nbbull"]);
        
        // Récupérer les données actuelles du joueur
        const players = await bddPlayer.get({name: playerName});
        console.log(`Recherche du joueur: ${playerName} - Trouvé:`, players ? players.length : 0);
        
        if (players && players.length > 0) {
            const player = players[0];
            console.log(`Données actuelles du joueur:`, player);
            
            // Incrémenter le nombre de parties jouées
            player.nbgames = parseInt(player.nbgames || 0) + 1;
            
            // Mettre à jour les statistiques du joueur
            if (stats) {
                // Ajouter les hits
                player.nbhit = parseInt(player.nbhit || 0) + parseInt(stats.nbHit || 0);
                
                // Ajouter les lancers
                player.nbthrow = parseInt(player.nbthrow || 0) + parseInt(stats.nbThrow || 0);
                
                // Ajouter les triples
                player.nbtriple = parseInt(player.nbtriple || 0) + parseInt(stats.nbTriple || 0);
                
                // Ajouter les doubles
                player.nbdouble = parseInt(player.nbdouble || 0) + parseInt(stats.nbDouble || 0);
                
                // Ajouter les bulls
                player.nbbull = parseInt(player.nbbull || 0) + parseInt(stats.nbBull || 0) + parseInt(stats.nbDoubleBull || 0);
            }
            
            console.log(`Nouvelles données du joueur à écrire:`, player);
            
            // Mettre à jour le joueur dans la base de données
            const result = await bddPlayer.edit({name: playerName}, player);
            console.log(`Résultat de la mise à jour:`, result);
            
            return true;
        } else {
            console.warn(`Joueur non trouvé: ${playerName}`);
            return false;
        }
    } catch (error) {
        console.error(`Erreur lors de la mise à jour des statistiques du joueur ${playerName}:`, error);
        console.error("Chemin du fichier:", PLAYERS_CSV_PATH);
        return false;
    }
}

module.exports = {
    addPlayers,
    getPlayers,
    deletePlayer,
    updatePlayerStats
};

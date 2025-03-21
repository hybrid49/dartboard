const express = require('express');
const csvdb = require("csv-database");
const path = require('path');

// Définir le chemin absolu vers le fichier CSV
const PLAYERS_CSV_PATH = path.resolve(__dirname, './players.csv');

// Définition de la structure de la base de données avec les champs de couleur
const playerFields = [
  "id", "name", "nbgames", "nbhit", "nbthrow", "nbtriple", "nbdouble", "nbbull", 
  "color", "colorDarker", "colorTransparent"
];

async function getPlayers() {
    try {
        const bddPlayer = await csvdb(PLAYERS_CSV_PATH, playerFields);
        return bddPlayer.get();
    } catch (error) {
        console.error("Erreur lors du chargement des joueurs :", error);
        console.error("Chemin du fichier:", PLAYERS_CSV_PATH);
        return [];
    }
}

async function addPlayers(playerData) {
    try {
        const bddPlayer = await csvdb(PLAYERS_CSV_PATH, playerFields);
        players = await getPlayers();
        
        // Si playerData est juste une chaîne, c'est le nom du joueur (ancienne version)
        let playerName = typeof playerData === 'string' ? playerData : playerData.name;
        let playerColor = typeof playerData === 'string' ? '#e53935' : (playerData.color || '#e53935');
        
        // Couleurs dérivées
        let playerColorDarker = typeof playerData === 'object' && playerData.colorDarker ? 
            playerData.colorDarker : '#c62828';
        let playerColorTransparent = typeof playerData === 'object' && playerData.colorTransparent ? 
            playerData.colorTransparent : 'rgba(198, 40, 40, 0.4)';
        
        await bddPlayer.add({
            id: players.length, 
            name: playerName, 
            nbgames: 0, 
            nbhit: 0, 
            nbthrow: 0, 
            nbtriple: 0, 
            nbdouble: 0, 
            nbbull: 0, 
            color: playerColor,
            colorDarker: playerColorDarker,
            colorTransparent: playerColorTransparent
        });
        console.log(`Joueur ajouté: ${playerName} avec couleurs: ${playerColor}, ${playerColorDarker}, ${playerColorTransparent}`);
    } catch (error) {
        console.error("Erreur lors de l'ajout du joueur:", error);
        console.error("Chemin du fichier:", PLAYERS_CSV_PATH);
    }
}

async function deletePlayer(playerId) {
    try {
        const bddPlayer = await csvdb(PLAYERS_CSV_PATH, playerFields);
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
        const bddPlayer = await csvdb(PLAYERS_CSV_PATH, playerFields);
        
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
                
                // Mettre à jour les couleurs si elles sont fournies
                if (stats.color) {
                    player.color = stats.color;
                }
                if (stats.colorDarker) {
                    player.colorDarker = stats.colorDarker;
                }
                if (stats.colorTransparent) {
                    player.colorTransparent = stats.colorTransparent;
                }
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

/**
 * Met à jour la couleur d'un joueur existant
 * @param {string} playerName - Nom du joueur à mettre à jour
 * @param {string} color - Nouvelle couleur au format hexadécimal
 * @param {string} colorDarker - Couleur plus sombre (optionnel)
 * @param {string} colorTransparent - Couleur transparente (optionnel)
 * @returns {boolean} - Succès ou échec de la mise à jour
 */
async function updatePlayerColor(playerName, color, colorDarker, colorTransparent) {
    try {
        // Charger la base de données
        const bddPlayer = await csvdb(PLAYERS_CSV_PATH, playerFields);
        
        // Récupérer les données actuelles du joueur
        const players = await bddPlayer.get({name: playerName});
        
        if (players && players.length > 0) {
            const player = players[0];
            
            // Mettre à jour les couleurs
            if (typeof color === 'object' && color !== null) {
                // Si le premier argument est un objet contenant les couleurs
                player.color = color.color || player.color;
                player.colorDarker = color.colorDarker || player.colorDarker;
                player.colorTransparent = color.colorTransparent || player.colorTransparent;
            } else {
                // Sinon, utiliser les arguments individuels
                player.color = color || player.color;
                if (colorDarker) player.colorDarker = colorDarker;
                if (colorTransparent) player.colorTransparent = colorTransparent;
            }
            
            // Mettre à jour le joueur dans la base de données
            await bddPlayer.edit({name: playerName}, player);
            console.log(`Couleurs mises à jour pour ${playerName}: ${player.color}, ${player.colorDarker}, ${player.colorTransparent}`);
            
            return true;
        } else {
            console.warn(`Joueur non trouvé: ${playerName}`);
            return false;
        }
    } catch (error) {
        console.error(`Erreur lors de la mise à jour des couleurs du joueur ${playerName}:`, error);
        return false;
    }
}

module.exports = {
    addPlayers,
    getPlayers,
    deletePlayer,
    updatePlayerStats,
    updatePlayerColor
};

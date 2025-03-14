/**
 * statsManager.js - Module pour gérer la sauvegarde des statistiques de jeu
 * 
 * Ce fichier peut être inclus dans tous les modes de jeu pour sauvegarder
 * les statistiques à la fin d'une partie et les envoyer au serveur.
 */

// Initialiser le temps de début de jeu dès le chargement de la page
window.gameStartTime = new Date().getTime();

// Fonction de sauvegarde générique des statistiques d'une partie
function saveGameStats(winner, gameMode, customStats = {}) {
    console.log("Sauvegarde des statistiques de jeu...", winner, gameMode);
    
    // Récupération des noms des joueurs
    let playerNames = [];
    for (let i = 1; i <= nombrePlayer; i++) {
        // Essaye de récupérer le nom du joueur depuis différents formats possibles
        const playerNameElement = $('.zoneScorePlayer' + i + ' .titlePlayer').text().trim() || 
                                 $('.player-name[data-player="' + i + '"]').text().trim() ||
                                 $('#zoneScorePlayer' + i + ' .titlePlayer').text().trim();
        
        // Nettoyer le nom (enlever les espaces supplémentaires)
        const playerName = playerNameElement ? playerNameElement.trim() : ('Joueur ' + i);
        playerNames.push(playerName);
    }
    
    console.log("Noms des joueurs identifiés:", playerNames);
    
    // Préparation des statistiques par joueur
    let playerStats = {};
    let totalHits = 0;
    let totalMisses = 0;
    
    arrayTouch.forEach((item, index) => {
        if (index > 0) { // Ignorer l'index 0 qui n'est pas utilisé
            // Comptabiliser les touches et les manques
            const playerHits = item['nbHit'] || 0;
            const playerMisses = item['nbMiss'] || 0;
            
            totalHits += playerHits;
            totalMisses += playerMisses;
            
            // Stats de base pour tous les modes
            playerStats[index] = {
                points: item['point'] || 0,
                nbHit: playerHits,
                nbMiss: playerMisses,
                nbThrow: (playerHits + playerMisses) || 0,
                nbSingle: item['nbSingle'] || 0,
                nbDouble: item['nbDouble'] || 0,
                nbTriple: item['nbTriple'] || 0,
                nbBull: item['nbBull'] || 0,
                nbDoubleBull: item['nbDoubleBull'] || 0,
                accuracy: playerHits > 0 ? Math.round((playerHits / (playerHits + playerMisses)) * 100) : 0
            };
            
            // Ajouter les stats spécifiques au mode de jeu
            if (customStats[index]) {
                Object.assign(playerStats[index], customStats[index]);
            }
            
            // Pour les modes avec des cibles spécifiques
            if (typeof arrayTargets !== 'undefined' && Array.isArray(arrayTargets)) {
                playerStats[index].targets = {};
                
                // Ajouter les statistiques par cible
                arrayTargets.forEach((target) => {
                    if (target && item[target] !== undefined) {
                        playerStats[index].targets[target] = (item[target] || 0);
                    }
                });
            }
            
            console.log(`Statistiques du joueur ${index} (${playerNames[index-1]}):`, playerStats[index]);
        }
    });
    
    // Formatage du nom du mode de jeu
    let modeName = gameMode || "Unknown";
    
    // Calcul de la précision totale
    const accuracy = totalHits > 0 ? Math.round((totalHits / (totalHits + totalMisses)) * 100) : 0;
    
    // Création de l'objet de données
    const gameData = {
        winner: winner,
        playerNames: playerNames,
        stats: playerStats,
        round: round,
        mode: modeName,
        gameInfo: {
            totalHits: totalHits,
            totalMisses: totalMisses,
            totalThrows: totalHits + totalMisses,
            accuracy: accuracy,
            duration: new Date().getTime() - window.gameStartTime,
            date: new Date().toISOString()
        }
    };
    
    console.log("Données complètes à envoyer:", gameData);
    
    // Envoi des données au serveur
    socket.emit('saveGameStats', gameData);
    
    // Mise à jour des statistiques des joueurs enregistrés
    playerNames.forEach((name, index) => {
        // Si le nom n'est pas au format "Joueur X" ou "Player X", c'est un joueur enregistré
        if (!name.match(/^(Joueur|Player)\s+\d+$/)) {
            console.log(`Mise à jour des statistiques du joueur ${name}:`, playerStats[index + 1]);
            
            // Envoi des statistiques au serveur pour mise à jour du profil joueur
            socket.emit('updatePlayerStats', {
                name: name,
                stats: playerStats[index + 1],
                gameMode: modeName
            });
        }
    });
    
    console.log('Statistiques sauvegardées pour le mode ' + modeName);
    
    // Debug pour vérifier la connexion Socket.IO
    if (!socket.connected) {
        console.error("ERREUR: Socket.IO n'est pas connecté! Les statistiques ne seront pas sauvegardées.");
    }
    
    return gameData; // Retourne les données pour d'éventuelles utilisations supplémentaires
} 
# Projet de Matrice de Boutons et Contrôle de LED

## Description
Ce projet utilise une cible de flechete dont la matrice est connectée a l'arduino de boutons et une bande de LED pour créer une interface interactive. Le fichier `dart.ino` gère la matrice et deux boutons poussoirs, tandis que le fichier `led.ino` contrôle la bande de LED, les boutons de navigation et des commandes reçues via la communication série.

## Table des Matières
- [Installation](#installation)
- [Utilisation](#utilisation)
- [Fonctionnalités](#fonctionnalités)
- [Licence](#licence)
- [Contact](#contact)

## Installation
2. Ouvrez le projet dans l'IDE Arduino.
3. Assurez-vous d'avoir installé les bibliothèques nécessaires :
   - `Adafruit_NeoPixel` pour le contrôle des LED.

## Utilisation
1. Connectez les broches de votre matrice de boutons et de votre bande de LED selon les définitions dans les fichiers `dart.ino` et `led.ino`.
2. Téléversez le code `dart.ino` sur votre Arduino pour gérer la matrice de boutons.
3. Téléversez le code `led.ino` sur un autre Arduino pour contrôler la bande de LED.
4. Ouvrez le moniteur série pour voir les sorties des boutons et envoyer des commandes de couleur aux LED.

## Fonctionnalités
- **Matrice de Boutons (`dart.ino`)** :
   - Détecte les appuis sur les touche de la cible via la matrice.
   - Detecte les appuis sur les deux boutons de validation et retour en arriere.
   - Envoie les coordonnées des boutons appuyés via la communication série.
   - Gère deux boutons supplémentaires pour les actions de validation et d'annulation.

- **Contrôle de LED (`led.ino`)** :
   - Contrôle une bande de LED NeoPixel.
   - Change la couleur des LED en fonction des commandes reçues via la communication série.
   - Gère quatre boutons pour des actions spécifiques (droite, gauche, haut, bas).

## Licence
Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## Contact
- Charrier Paul -

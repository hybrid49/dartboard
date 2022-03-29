/*
 * Code d'exemple pour une LED RGB (8 couleurs).
 */
 
/* Couleurs (format RGB) */
const byte COLOR_BLACK = 0b000;
const byte COLOR_RED = 0b100;
const byte COLOR_GREEN = 0b010;
const byte COLOR_BLUE = 0b001;
const byte COLOR_MAGENTA = 0b101;
const byte COLOR_CYAN = 0b011;
const byte COLOR_YELLOW = 0b110;
const byte COLOR_WHITE = 0b111;

/* Broches */
const byte PIN_LED_R = 3;
const byte PIN_LED_G = 5;
const byte PIN_LED_B = 6;

// Fonction setup(), appelée au démarrage de la carte Arduino
void setup() {

  // Initialise les broches
  pinMode(PIN_LED_R, OUTPUT);
  pinMode(PIN_LED_G, OUTPUT);
  pinMode(PIN_LED_B, OUTPUT);
  displayColor(COLOR_BLACK);
}

// Fonction loop(), appelée continuellement en boucle tant que la carte Arduino est alimentée
void loop() {
  
  /* Code de démonstration */
  displayColor(COLOR_RED);
  delay(1000);
  
  displayColor(COLOR_GREEN);
  delay(1000);
  
  displayColor(COLOR_BLUE);
  delay(1000);
  
  displayColor(COLOR_MAGENTA);
  delay(1000);
  
  displayColor(COLOR_CYAN);
  delay(1000);
  
  displayColor(COLOR_YELLOW);
  delay(1000);
  
  displayColor(COLOR_WHITE);
  delay(1000);
  
  displayColor(COLOR_BLACK);
  delay(1000);
}

/** Affiche une couleur */
void displayColor(byte color) {

  // Assigne l'état des broches
  // Version cathode commune
  //digitalWrite(PIN_LED_R, bitRead(color, 2));
  //digitalWrite(PIN_LED_G, bitRead(color, 1));
  //digitalWrite(PIN_LED_B, bitRead(color, 0));
  // Version anode commune
  digitalWrite(PIN_LED_R, !bitRead(color, 2));
  digitalWrite(PIN_LED_G, !bitRead(color, 1));
  digitalWrite(PIN_LED_B, !bitRead(color, 0));
}

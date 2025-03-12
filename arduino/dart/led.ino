#include <Adafruit_NeoPixel.h>

#define PIN 6  // Pin auquel la bande de LED est connectée
#define NUM_LEDS 10  // Nombre de LED dans la bande

Adafruit_NeoPixel strip = Adafruit_NeoPixel(NUM_LEDS, PIN, NEO_GRB + NEO_KHZ800);

// Définir les pins des 4 boutons
int btn1 = A0;  // Premier bouton (validation)
int btn2 = A1;  // Deuxième bouton (annulation)
int btn3 = A2;  // Troisième bouton
int btn4 = A3;  // Quatrième bouton

int buttonState1 = 0;         // état actuel du bouton
int lastButtonState1 = 0;     // état précédent du bouton

int buttonState2 = 0;
int lastButtonState2 = 0;

int buttonState3 = 0;
int lastButtonState3 = 0;

int buttonState4 = 0;
int lastButtonState4 = 0;

void setup() {
  Serial.begin(9600);  // Initialiser la communication série
  strip.begin();
  strip.show();  // Assure-toi que toutes les LED sont éteintes au départ

  pinMode(btn1, INPUT_PULLUP);  // Définir les boutons comme entrée avec résistance pull-up interne
  pinMode(btn2, INPUT_PULLUP);
  pinMode(btn3, INPUT_PULLUP);
  pinMode(btn4, INPUT_PULLUP);
}

void loop() {
  // Lire l'état des boutons
  buttonState1 = digitalRead(btn1);
  buttonState2 = digitalRead(btn2);
  buttonState3 = digitalRead(btn3);
  buttonState4 = digitalRead(btn4);

  // Vérifier si le premier bouton a changé d'état
  if (buttonState1 != lastButtonState1) {
    if (buttonState1 == LOW) {
      Serial.println("btnRight");
    }
    delay(50);  // Anti-rebond
  }

  // Vérifier si le deuxième bouton a changé d'état
  if (buttonState2 != lastButtonState2) {
    if (buttonState2 == LOW) {
      Serial.println("btnLeft");
    }
    delay(50);  // Anti-rebond
  }

  // Vérifier si le troisième bouton a changé d'état
  if (buttonState3 != lastButtonState3) {
    if (buttonState3 == LOW) {
      Serial.println("btnTop");
    }
    delay(50);  // Anti-rebond
  }

  // Vérifier si le quatrième bouton a changé d'état
  if (buttonState4 != lastButtonState4) {
    if (buttonState4 == LOW) {
      Serial.println("btnBtoom");
    }
    delay(50);  // Anti-rebond
  }

  // Sauvegarder l'état précédent de chaque bouton
  lastButtonState1 = buttonState1;
  lastButtonState2 = buttonState2;
  lastButtonState3 = buttonState3;
  lastButtonState4 = buttonState4;

  if (Serial.available() > 0) {
      String color = Serial.readStringUntil('\n');  // Lire les données envoyées par le Raspberry Pi jusqu'à '\n'
      changeColor(color);  // Appeler la fonction pour changer la couleur des LED
    }
}

void changeColor(String color) {
  if (color == "rouge") {
    setColor(255, 0, 0);  // Rouge
  } else if (color == "vert") {
    setColor(0, 255, 0);  // Vert
  } else if (color == "bleu") {
    setColor(0, 0, 255);  // Bleu
  } else if (color == "off") {
    setColor(0, 0, 0);  // Éteindre les LED
  }
}

void setColor(int r, int g, int b) {
  for (int i = 0; i < NUM_LEDS; i++) {
    strip.setPixelColor(i, strip.Color(r, g, b));
  }
  strip.show();
}

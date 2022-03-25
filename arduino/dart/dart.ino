  int masterLines = 8; //Change here to the number of lines of your Master Layer
int slaveLines = 8; //Change here to the number of lines of your Slave Layer

int matrixMaster[] = {13, 12, 11, 10, 9, 8, 7, 6}; //Put here the pins you connected the lines of your Master Layer
int matrixSlave[] = {5, 4, 3, 2, A5, A4, A3, A2}; //Put here the pins you connected the lines of your Slave Layer
int btn = A1;
int btn2 = A0;

int buttonState = 0;         // current state of the button
int lastButtonState = 0;     // previous state of the button

int buttonState2 = 0;         // current state of the button
int lastButtonState2 = 0;     // previous state of the button

void setup() {
    Serial.begin(9600);

    for(int i = 0; i < slaveLines; i++){
        pinMode(matrixSlave[i], INPUT_PULLUP);
    }

    for(int i = 0; i < masterLines; i++){
        pinMode(matrixMaster[i], OUTPUT);
        digitalWrite(matrixMaster[i], HIGH);
    }
     pinMode(btn, INPUT);
     pinMode(btn2, INPUT);
    
}

void loop() {
    for(int i = 0; i < masterLines; i++){
        digitalWrite(matrixMaster[i], LOW);
        for(int j = 0; j < slaveLines; j++){
            if(digitalRead(matrixSlave[j]) == LOW){
                Serial.print(j);
                Serial.print(",");
                Serial.println(i);
                delay(500);
                break;
            }
        }
        digitalWrite(matrixMaster[i], HIGH);
    }
    buttonState = digitalRead(btn);
    buttonState2 = digitalRead(btn2);
   
    if (buttonState != lastButtonState) {
      // if the state has changed, increment the counter
      if (buttonState == HIGH) {
      } else {
        // if the current state is LOW then the button went from on to off:
        Serial.println("changePlayer");
      }
      // Delay a little bit to avoid bouncing
      delay(50);
    }
     if (buttonState2 != lastButtonState2) {
      // if the state has changed, increment the counter
      if (buttonState2 == HIGH) {
      } else {
        // if the current state is LOW then the button went from on to off:
        Serial.println("btnCancel");
      }
      // Delay a little bit to avoid bouncing
      delay(50);
    }
    lastButtonState = buttonState;
    lastButtonState2 = buttonState2;
    
}

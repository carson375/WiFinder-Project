#include <Arduino.h>
#include <Bitcraze_PMW3901.h>
#include <SPI.h>

 Bitcraze_PMW3901 flow(10);

void setup() {
  Serial.begin(9600);
  Serial.print("MOSI: ");
  Serial.println(MOSI);
  Serial.print("MISO: ");
  Serial.println(MISO);
  Serial.print("SCK: ");
  Serial.println(SCK);
  Serial.print("SS: ");
  Serial.println(SS);  
  if (!flow.begin()) {
    Serial.println("Initialization of the flow sensor 1 failed");
    while(1) { }
  }

}

int i =0;
int16_t deltaX,deltaY;

void loop() {
  if ((i % 2) == 0) {
    digitalWrite(10, LOW); // sets the digital pin 10 on
    flow.readMotionCount(&deltaX, &deltaY);
    digitalWrite(10, HIGH);  // sets the digital pin 9 off
  }

    i = i + 1;
    Serial.print("X1:");
    Serial.print(deltaX);
    Serial.print("\t");
    Serial.print("Y1:");
    Serial.print(deltaY);
    Serial.print("\t");
    delay(1000);
    Serial.println();
}
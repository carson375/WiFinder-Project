/* Note: the following code is a modification of the Knob Example that
* comes with the ESC library, so that it works with an ESP32 DevKit V1
* and my particular ESC (generic 30A) and brushless motor (generic 2200KV)
*/

#include <ESP32Servo.h> // ESP32Servo library installed by Library Manager
#include "ESC.h" // RC_ESP library installed by Library Manager

#define ESC_PIN1 (2) // connected to ESC control wire
#define ESC_PIN2 (15) // connected to ESC control wire
#define ESC_PIN3 (16) // connected to ESC control wire
#define ESC_PIN4 (17) // connected to ESC control wire
#define POT_PIN (13) // Analog pin used to connect the potentiometer center pin

// Note: the following speeds may need to be modified for your particular hardware.
#define MIN_SPEED 1040 // speed just slow enough to turn motor off
#define MAX_SPEED 1240 // speed where my motor drew 3.6 amps at 12v.

ESC myESC1 (ESC_PIN1, MIN_SPEED, MAX_SPEED, 127); // ESC_Name (PIN, Minimum Value, Maximum Value, Arm Value)
ESC myESC2 (ESC_PIN2, MIN_SPEED, MAX_SPEED, 127); // ESC_Name (PIN, Minimum Value, Maximum Value, Arm Value)
ESC myESC3 (ESC_PIN3, MIN_SPEED, MAX_SPEED, 127); // ESC_Name (PIN, Minimum Value, Maximum Value, Arm Value)
ESC myESC4 (ESC_PIN4, MIN_SPEED, MAX_SPEED, 127); // ESC_Name (PIN, Minimum Value, Maximum Value, Arm Value)

long int val; // variable to read the value from the analog pin

void setup() {
Serial.begin(115200);
//analogReadResolution(6);
delay(1000);
pinMode(POT_PIN, INPUT);
pinMode(ESC_PIN1, OUTPUT); //set motor pins to output
pinMode(ESC_PIN2, OUTPUT);
pinMode(ESC_PIN3, OUTPUT);
pinMode(ESC_PIN4, OUTPUT);

pinMode(LED_BUILTIN, OUTPUT);
digitalWrite(LED_BUILTIN, HIGH); // set led to on to indicate arming
myESC1.arm(); // Send the Arm command to ESC
delay(5000); // Wait a while
myESC2.arm();
delay(5000); // Wait a while
myESC3.arm();
delay(5000); // Wait a while
myESC4.arm();
delay(5000); // Wait a while
digitalWrite(LED_BUILTIN, LOW); // led off to indicate arming completed

// the following loop turns on the motor slowly, so get ready
/*for (int i=0; i<350; i++){ // run speed from 840 to 1190
myESC1.speed(MIN_SPEED-200+i); // motor starts up about half way through loop
myESC2.speed(MIN_SPEED-200+i); // motor starts up about half way through loop
myESC3.speed(MIN_SPEED-200+i); // motor starts up about half way through loop
myESC4.speed(MIN_SPEED-200+i); // motor starts up about half way through loop
delay(10);
}*/
} // speed will now jump to pot setting

void loop() {
val = analogRead(POT_PIN); // read the pot (value between 0 and 4095 for ESP32 12 bit A to D)
Serial.println(val);
val = map(val, 0, 63, MIN_SPEED, MAX_SPEED); // scale pot reading to valid speed range
myESC1.speed(val); // sets the ESC speed
myESC2.speed(val); // sets the ESC speed
myESC3.speed(val); // sets the ESC speed
myESC4.speed(val); // sets the ESC speed
delay(10); // Wait for a while
}
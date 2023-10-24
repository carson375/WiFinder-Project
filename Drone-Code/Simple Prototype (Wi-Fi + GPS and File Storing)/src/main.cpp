#include "Arduino.h"
#include "FS.h"
#include "SPIFFS.h"
#include "WiFi.h"
#include "TinyGPS++.h"
#include "SoftwareSerial.h"
#include "functions.h"
#include "Adafruit_MPU6050.h"
#define FORMAT_SPIFFS_IF_FAILED true

static const int RXPin = 18, TXPin = 17; //main pins on esp32 
static const uint32_t GPSBaud = 9600; 
float XAccelOffset = -.56;//-935; 
float YAccelOffset = 0; 
float ZAccelOffset = -2.69;//-4492; 

// The TinyGPS++ object 
TinyGPSPlus gps; 
Adafruit_MPU6050 mpu; 
// The serial connection to the GPS device 
SoftwareSerial GPS_Serial(RXPin, TXPin);

void addData(double Value, bool Valid){
  
}

//gps function to make sure data is being read 
static void smartDelay(unsigned long ms)
{
  unsigned long start = millis();
  do 
  { 
    while (GPS_Serial.available()) 
      gps.encode(GPS_Serial.read()); 
  } while (millis() - start < ms);
}

static void printFloat(float val, bool valid, int len, int prec)
{
  if (valid)
  {
    Serial.println(val, prec);
    int vi = abs((int)val);
    int flen = prec + (val < 0.0 ? 2 : 1); // . and -
    flen += vi >= 1000 ? 4 : vi >= 100 ? 3 : vi >= 10 ? 2 : 1;
    for (int i=flen; i<len; ++i)
      Serial.print(' ');
  }
}

void setup() {
  
  Serial.begin(115200);
  GPS_Serial.begin(GPSBaud); //start GPS communication and set rate
  mpu.begin();
  mpu.setAccelerometerRange(MPU6050_RANGE_2_G);
  mpu.setGyroRange(MPU6050_RANGE_500_DEG);
  mpu.setFilterBandwidth(MPU6050_BAND_21_HZ);
  if(!SPIFFS.begin(FORMAT_SPIFFS_IF_FAILED)){
    Serial.println("SPIFFS Mount Failed");
    return;
  }
  WiFi.mode(WIFI_STA);
  WiFi.disconnect();

  writeFile(SPIFFS, "/flightPath.txt", "Wi-Fi  Lat  Long");
}

void loop() {
  sensors_event_t a, g, temp;
  mpu.getEvent(&a, &g, &temp);
  // WiFi.scanNetworks will return the number of networks found
  int n = WiFi.scanNetworks();
  int maxWiFi = -1000;
  Serial.println("scan done");
  for (int i = 0; i < n; ++i) {
    if ( WiFi.SSID(i) == "Hey_Kevin" )
    {
      if(maxWiFi < WiFi.RSSI(i))
      {
        maxWiFi = WiFi.RSSI(i);
      }
    }
    delay(10);
  }

  //GPS readings
  printFloat(maxWiFi, maxWiFi!=-1000, 7, 2);
  printFloat(gps.location.lat(), gps.location.isValid(), 11, 6);
  printFloat(gps.location.lng(), gps.location.isValid(), 12, 6);
  printFloat(gps.altitude.meters(), gps.altitude.isValid(), 7, 2);
  printFloat(gps.course.deg(), gps.course.isValid(), 7, 2);

  char Value1 [6]; //max value in character form
  char Value2 [12];
  char Value3 [12];
  char Upload [40] = "";
  itoa(maxWiFi, Value1, 10); //converts the int to a char
  strcat(Upload,Value1);
  dtostrf(gps.location.lat(), 4, 6, Value2);
  strcat(Upload, " ");
  strcat(Upload, Value2);
  dtostrf(gps.location.lng(), 4, 6, Value3);
  strcat(Upload, " ");
  strcat(Upload,Value3);
  Serial.println(Upload);
  appendFile(SPIFFS, "/flightPath.txt", Upload); //adds that value to the text file
  smartDelay(0);

  Serial.print("Acceleration X: ");
  Serial.print(a.acceleration.x + XAccelOffset);
  Serial.print(", Y: ");
  Serial.print(a.acceleration.y + YAccelOffset);
  Serial.print(", Z: ");
  Serial.print(a.acceleration.z + ZAccelOffset);
  Serial.println(" m/s^2");
  Serial.print("Rotation X: ");
  Serial.print(g.gyro.x);
  Serial.print(", Y: ");
  Serial.print(g.gyro.y);
  Serial.print(", Z: ");
  Serial.print(g.gyro.z);
  Serial.println(" rad/s");

  File file = SPIFFS.open("/flightPath.txt"); //check file size and confirm it hasn't grown too large
  Serial.println(file.size());
  if(file.size() > 20000){
    while(1);
  }
  smartDelay(1000);
}









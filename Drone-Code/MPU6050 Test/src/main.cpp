#include <Wire.h>
#include <Adafruit_Sensor.h>
#include <Arduino.h>
#include <SPI.h>
#include <Adafruit_MPU6050.h>
Adafruit_MPU6050 mpu;

//These need to be changed based on he setting for the Gyro and acceleration 
//Both always have a range of [-32768, +32767]. 
//The default setting is +/- 2g for the accel and +/- 250 deg/sec for the gyro
//so for 2G range 9.81 = 16384 and for 4G 9.81 = 8192 and so on
const int Gravity = 9.81;
const int RawGravity = 16384;
float XAccelOffset = -.56;//-935; 
float YAccelOffset = 0;
float ZAccelOffset = -2.69;//-4492;

void setup(void) {
  
  Serial.begin(115200);
  while (!Serial)
    delay(10); // will pause Zero, Leonardo, etc until serial console opens

  Serial.println("Adafruit MPU6050 test!");

  // Try to initialize!
  if (!mpu.begin()) {
    Serial.println("Failed to find MPU6050 chip");
    while (1) {
      delay(10);
    }
  }
  Serial.println("MPU6050 Found!");

  mpu.setAccelerometerRange(MPU6050_RANGE_2_G);
  Serial.print("Accelerometer range set to: ");
  switch (mpu.getAccelerometerRange()) {
  case MPU6050_RANGE_2_G:
    Serial.println("+-2G");
    //XAccelOffset = XAccelOffset*Gravity/RawGravity;
    //YAccelOffset = YAccelOffset*Gravity/RawGravity;
    //ZAccelOffset = ZAccelOffset*Gravity/RawGravity;
    break;
  case MPU6050_RANGE_4_G:
    Serial.println("+-4G");
    XAccelOffset = XAccelOffset*Gravity/RawGravity/2;
    YAccelOffset = YAccelOffset*Gravity/RawGravity/2;
    ZAccelOffset = ZAccelOffset*Gravity/RawGravity/2;
    break;
  case MPU6050_RANGE_8_G:
    Serial.println("+-8G");
    XAccelOffset = XAccelOffset*Gravity/RawGravity;
    YAccelOffset = YAccelOffset*Gravity/RawGravity;
    ZAccelOffset = ZAccelOffset*Gravity/RawGravity;
    break;
  case MPU6050_RANGE_16_G:
    Serial.println("+-16G");
    XAccelOffset = XAccelOffset*Gravity/RawGravity/8;
    YAccelOffset = YAccelOffset*Gravity/RawGravity/8;
    ZAccelOffset = ZAccelOffset*Gravity/RawGravity/8;
    break;
  }
  mpu.setGyroRange(MPU6050_RANGE_500_DEG);
  Serial.print("Gyro range set to: ");
  switch (mpu.getGyroRange()) {
  case MPU6050_RANGE_250_DEG:
    Serial.println("+- 250 deg/s");
    break;
  case MPU6050_RANGE_500_DEG:
    Serial.println("+- 500 deg/s");
    break;
  case MPU6050_RANGE_1000_DEG:
    Serial.println("+- 1000 deg/s");
    break;
  case MPU6050_RANGE_2000_DEG:
    Serial.println("+- 2000 deg/s");
    break;
  }

  mpu.setFilterBandwidth(MPU6050_BAND_21_HZ);
  Serial.print("Filter bandwidth set to: ");
  switch (mpu.getFilterBandwidth()) {
  case MPU6050_BAND_260_HZ:
    Serial.println("260 Hz");
    break;
  case MPU6050_BAND_184_HZ:
    Serial.println("184 Hz");
    break;
  case MPU6050_BAND_94_HZ:
    Serial.println("94 Hz");
    break;
  case MPU6050_BAND_44_HZ:
    Serial.println("44 Hz");
    break;
  case MPU6050_BAND_21_HZ:
    Serial.println("21 Hz");
    break;
  case MPU6050_BAND_10_HZ:
    Serial.println("10 Hz");
    break;
  case MPU6050_BAND_5_HZ:
    Serial.println("5 Hz");
    break;
  }
  
  Serial.println("");
  delay(100);
}

void loop() {

  /* Get new sensor events with the readings */
  sensors_event_t a, g, temp;
  mpu.getEvent(&a, &g, &temp);

  /* Print out the values */
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

  Serial.print("Temperature: ");
  Serial.print(temp.temperature);
  Serial.println(" degC");

  Serial.println("");
  delay(500);
}
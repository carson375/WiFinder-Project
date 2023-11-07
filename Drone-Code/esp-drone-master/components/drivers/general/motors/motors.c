/**
 *
 * ESP-Drone Firmware
 *
 * Copyright 2019-2020  Espressif Systems (Shanghai)
 * Copyright (C) 2011-2012 Bitcraze AB
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, in version 3.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 * motors.c - Motor driver
 *
 */

#include <stdbool.h>

//FreeRTOS includes
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"

#include "stm32_legacy.h"
#include "motors.h"
#include "pm_esplane.h"
#include "log.h"
#define DEBUG_MODULE "MOTORS"
#include "debug_cf.h"

#include "driver/mcpwm.h"


uint32_t motor_ratios[] = {0, 0, 0, 0};
const uint16_t MOT_UNIT[4] = {0, 0, 0, 1}; //motor definitions for the unit and timers 
const uint16_t MOT_TIMER[4] = {0, 1, 2, 0};
void motorsPlayTone(uint16_t frequency, uint16_t duration_msec);
void motorsPlayMelody(uint16_t *notes);
void motorsBeep(int id, bool enable, uint16_t frequency, uint16_t ratio);

const MotorPerifDef **motorMap; /* Current map configuration */
//static const char *TAG = "example";
const uint32_t MOTORS[] = {MOTOR_M1, MOTOR_M2, MOTOR_M3, MOTOR_M4};

//const uint16_t testsound[NBR_OF_MOTORS] = {A4, A5, F5, D5};

static bool isInit = false;

/* Public functions */

//Initialization. Will set all motors ratio to 0%
void motorsInit(const MotorPerifDef **motorMapSelect)
{


    if (isInit) {
        // First to init will configure it
        return;
    }

    motorMap = motorMapSelect;

    mcpwm_gpio_init(MOT_UNIT[0], MOT_SIG, MOTOR1_GPIO);
    mcpwm_config_t pwm_config_motor0 = {
        .frequency = 50, 
        .cmpr_a = 0,    
        .counter_mode = MCPWM_UP_COUNTER,
        .duty_mode = MCPWM_DUTY_MODE_0,
    };
    mcpwm_init(MOT_UNIT[0], MOT_TIMER[0], &pwm_config_motor0);

    mcpwm_gpio_init(MOT_UNIT[1], MOT_SIG, MOTOR2_GPIO);
    mcpwm_config_t pwm_config_motor1 = {
        .frequency = 50,
        .cmpr_a = 0,     
        .counter_mode = MCPWM_UP_COUNTER,
        .duty_mode = MCPWM_DUTY_MODE_0,
    };
    mcpwm_init(MOT_UNIT[1], MOT_TIMER[1], &pwm_config_motor1);
    
    mcpwm_gpio_init(MOT_UNIT[2], MOT_SIG, MOTOR3_GPIO);
    mcpwm_config_t pwm_config_motor2 = {
        .frequency = 50,
        .cmpr_a = 0,     
        .counter_mode = MCPWM_UP_COUNTER,
        .duty_mode = MCPWM_DUTY_MODE_0,
    };
    mcpwm_init(MOT_UNIT[2], MOT_TIMER[2], &pwm_config_motor2);
    
    mcpwm_gpio_init(MOT_UNIT[3], MOT_SIG, MOTOR4_GPIO);
    mcpwm_config_t pwm_config_motor3 = {
        .frequency = 50,
        .cmpr_a = 0,     
        .counter_mode = MCPWM_UP_COUNTER,
        .duty_mode = MCPWM_DUTY_MODE_0,
    };
    mcpwm_init(MOT_UNIT[3], MOT_TIMER[3], &pwm_config_motor3);

    isInit = true;
}

void motorsDeInit(const MotorPerifDef **motorMapSelect)
{
    for (int i = 0; i < NBR_OF_MOTORS; i++) {
        mcpwm_stop(MOT_UNIT[i], MOT_TIMER[i]);
    }
}

bool motorsTest(void)
{
    int i;

    for (i = 0; i < sizeof(MOTORS) / sizeof(*MOTORS); i++) {
        if (motorMap[i]->drvType == BRUSHED) {
#ifdef ACTIVATE_STARTUP_SOUND
            motorsBeep(MOTORS[i], true, testsound[i], (uint16_t)(MOTORS_TIM_BEEP_CLK_FREQ / A4) / 20);
            vTaskDelay(M2T(MOTORS_TEST_ON_TIME_MS));
            motorsBeep(MOTORS[i], false, 0, 0);
            vTaskDelay(M2T(MOTORS_TEST_DELAY_TIME_MS));
#else
            motorsSetRatio(MOTORS[i], MOTORS_TEST_RATIO);
            vTaskDelay(M2T(MOTORS_TEST_ON_TIME_MS));
            motorsSetRatio(MOTORS[i], 0);
            vTaskDelay(M2T(MOTORS_TEST_DELAY_TIME_MS));
#endif
        }
    }

    return isInit;
}

// Ithrust is thrust mapped for 65536 <==> 60 grams
void motorsSetRatio(uint32_t id, uint16_t ithrust)
{
    if (isInit) {
        uint16_t ratio;

        ASSERT(id < NBR_OF_MOTORS);

        ratio = ithrust;

#ifdef ENABLE_THRUST_BAT_COMPENSATED

        if (motorMap[id]->drvType == BRUSHED) {
            float thrust = ((float)ithrust / 65536.0f) * 40; //根据实际重量修改
            float volts = -0.0006239f * thrust * thrust + 0.088f * thrust;
            float supply_voltage = pmGetBatteryVoltage();
            float percentage = volts / supply_voltage;
            percentage = percentage > 1.0f ? 1.0f : percentage;
            ratio = percentage * UINT16_MAX;
            motor_ratios[id] = ratio;
        }

#endif
        //ESP_LOGI(TAG, "Angle of rotation: %d ID number: ", ratio, id);
        
        ratio = (ratio - 0) * (MOTORS_MAX_SPEED - MOTORS_MIN_SPEED) / (65535 - 0) + MOTORS_MIN_SPEED; //maps value to Us to use in changing speed - max in is 65535 and min is 0 mapping to 1125 and 1500
        
        ESP_ERROR_CHECK(mcpwm_set_duty_in_us(MOT_UNIT[id], MOT_TIMER[id], MCPWM_OPR_A, ratio));
        motor_ratios[id] = ithrust;
#ifdef DEBUG_EP2
        DEBUG_PRINT_LOCAL("motors ID = %d ,ithrust_10bit = %d", id, (uint32_t)motorsConv16ToBits(ratio));
#endif
    }
}

int motorsGetRatio(uint32_t id)
{
    int ratio;
    ASSERT(id < NBR_OF_MOTORS);
    ratio = mcpwm_get_duty_in_us(MOT_UNIT[id], MOT_TIMER[id], MCPWM_OPR_A);
    return ratio;
}

/*void motorsBeep(int id, bool enable, uint16_t frequency, uint16_t ratio)
{
    uint32_t freq_hz = 15000;
    ASSERT(id < NBR_OF_MOTORS);
    if (ratio != 0) {
        ratio = (uint16_t)(0.05*(1<<16));
    }
    
    if (enable) {
        freq_hz = frequency;
    }
    
    ledc_set_freq(LEDC_LOW_SPEED_MODE,LEDC_TIMER_0,freq_hz);
    ledc_set_duty(motors_channel[id].speed_mode, motors_channel[id].channel, (uint32_t)motorsConv16ToBits(ratio));
    ledc_update_duty(motors_channel[id].speed_mode, motors_channel[id].channel);
}

// Play a tone with a given frequency and a specific duration in milliseconds (ms)
void motorsPlayTone(uint16_t frequency, uint16_t duration_msec)
{
    motorsBeep(MOTOR_M1, true, frequency, (uint16_t)(MOTORS_TIM_BEEP_CLK_FREQ / frequency) / 20);
    motorsBeep(MOTOR_M2, true, frequency, (uint16_t)(MOTORS_TIM_BEEP_CLK_FREQ / frequency) / 20);
    motorsBeep(MOTOR_M3, true, frequency, (uint16_t)(MOTORS_TIM_BEEP_CLK_FREQ / frequency) / 20);
    motorsBeep(MOTOR_M4, true, frequency, (uint16_t)(MOTORS_TIM_BEEP_CLK_FREQ / frequency) / 20);
    vTaskDelay(M2T(duration_msec));
    motorsBeep(MOTOR_M1, false, frequency, 0);
    motorsBeep(MOTOR_M2, false, frequency, 0);
    motorsBeep(MOTOR_M3, false, frequency, 0);
    motorsBeep(MOTOR_M4, false, frequency, 0);
}

// Plays a melody from a note array
void motorsPlayMelody(uint16_t *notes)
{
    int i = 0;
    uint16_t note;     // Note in hz
    uint16_t duration; // Duration in ms

    do
    {
      note = notes[i++];
      duration = notes[i++];
      motorsPlayTone(note, duration);
    } while (duration != 0);
}*/
LOG_GROUP_START(pwm)
LOG_ADD(LOG_UINT32, m1_pwm, &motor_ratios[0])
LOG_ADD(LOG_UINT32, m2_pwm, &motor_ratios[1])
LOG_ADD(LOG_UINT32, m3_pwm, &motor_ratios[2])
LOG_ADD(LOG_UINT32, m4_pwm, &motor_ratios[3])
LOG_GROUP_STOP(pwm)

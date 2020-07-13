/*
 * GPIO.h
 *
 *  Created on: 24.10.2014
 *      Author: Johannes Strasser
 *      www.strasys.at
 */

#ifndef GPIO_H_
#define GPIO_H_

#define GPIO_DIR "/sys/class/gpio"

unsigned int IN_OUT_1[20][2];
unsigned int IN_OUT_2[40][3];
unsigned int RESET_4D[2];
unsigned int TX_434MHz[2];

void init_GPIO(int devicetype);
int gpio_export(int gpio);
int gpio_set_direction(int gpio, int direction);
int gpio_set_value(int gpio, int value);
int gpio_get_value(int gpio);
void gpio_set_value_byte(int statusOut);

#endif /* GPIO_H_ */

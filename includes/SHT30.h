/*
 * SHT30.h
 *
 *  Created on: 05.03.2018
 *      Author: johannes
 */

#ifndef INCLUDES_SHT30_H_
#define INCLUDES_SHT30_H_

//single shot mode get humidity
float getSHT30single_humidity(int I2Caddr);
float getSHT30single_temperature(char Farrenheit_Celsius, int I2Caddr);
int getSHT30_measurement_data(int *_data, int I2Caddr, int *_input, unsigned char selector, int delay);
int getSHT30checksum(int data[], int nbrOfBytes);
void setSHT30_softreset(int I2Caddr);
void setSHT30_heater(int I2Caddr, unsigned char selector);
int getSHT30_status_register(unsigned int *_data, int I2Caddr);
void setSHT30_clear_status_register(int I2Caddr);
#endif /* INCLUDES_SHT30_H_ */

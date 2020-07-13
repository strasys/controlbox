/*
 * SHT30.c
 *
 *  Created on: 05.03.2018
 *      Author: Johannes Strasser
 *      www.strasys.at
 */
//--Includes-----
#include <stdio.h>
#include <stdlib.h>
#include <errno.h>
#include <string.h>
#include <unistd.h>
#include <stdint.h>
#include <math.h>
#include "I2C-handler.h"
#include "SHT30.h"

//--Defines----
//Generator polynomial for CRC
#define POLYNOMIAL 0x131 // P(x) = x^8 + x^5 + x^4 + 1 = 100110001

//single shot data acquisition mode
//Repeatability => Clock stretching => 	MSB => 	LSB
//High			=> enabled				0x2C	06
//Medium		=> enabled				0x2C	0D
//Low			=> enabled				0x2C	10
//High			=> disabled				0x24	00
//Medium		=> disabled				0x24	0B
//Low			=> disabled				0x24	16
#define MSB_clock 0b00101100
#define	LSB_clock_high 0b00000110
#define	LSB_clock_medium 0b00001101
#define LSB_clock_low 0b00010000
#define MSB_noclock 0b00100100
#define LSB_noclock_high 0b00000000
#define LSB_noclock_medium 0b00001011
#define LSB_noclock_low 0b00010110

float getSHT30single_humidity(int I2Caddr){
	int data[4]; //read out data
	int input[2]; //commands

	input[0] = MSB_noclock;
	input[1] = LSB_noclock_high;
	int delay = 100000;
	getSHT30_measurement_data(data, I2Caddr, input, 'H', delay);

	//calc checksum
	unsigned int checksum = getSHT30checksum(data, 2);
	//calc humidity
	float relHumidity;
	if (data[3] != checksum){
		//read again
		setSHT30_softreset(I2Caddr);
		getSHT30_measurement_data(data, I2Caddr, input, 'H', delay);
		relHumidity = 100 * data[2] / (pow(2, 16) - 1);
	}

	else relHumidity = 100 * data[2] / (pow(2, 16) - 1);

	return relHumidity;
}

float getSHT30single_temperature(char selector, int I2Caddr){
	int data[4]; //read out data
	int input[2]; //commands

	input[0] = MSB_noclock;
	input[1] = LSB_noclock_high;
	int delay = 100000;
	getSHT30_measurement_data(data, I2Caddr, input, 'T', delay);
	//calc checksum
	unsigned int checksum = getSHT30checksum(data, 2);
	//calc temperature
	float temperature;

	if (data[3] != checksum){
		//read again
		setSHT30_softreset(I2Caddr);
		getSHT30_measurement_data(data, I2Caddr, input, 'T', delay);
		if (selector == 'C') temperature = -45 + 175 * data[2] / (pow(2, 16) - 1);
		else if (selector == 'F') temperature = -49 + 315 * data[2] / (pow(2, 16) - 1);
	}
	else {
		if (selector == 'C') temperature = -45 + 175 * data[2] / (pow(2, 16) - 1);
		else if (selector == 'F') temperature = -49 + 315 * data[2] / (pow(2, 16) - 1);
	}

	return temperature;
}

int getSHT30_measurement_data(int *_data, int I2Caddr, int *_input, unsigned char selector, int delay){
	unsigned char buf[2];
	unsigned char bufread[6];
	int file, MSB, LSB, raw, crc;
	int MSB_raw, LSB_raw;
	// set single shot mode
	buf[0] = _input[0];
	buf[1] = _input[1];
	file = i2c_open(I2C1_path, I2Caddr);
	i2c_write(file, buf, 2);
	usleep(delay);
	//read conversion reg
	i2c_read(file, bufread, 6);
	i2c_close(file);
	//calc raw data
	if (selector == 'H'){
		MSB_raw = bufread[3];
		LSB_raw = bufread[4];
		MSB = (0x0000 | bufread[3]) << 8;
		LSB = (0x0000 | bufread[4]);
		raw = (MSB | LSB); // raw vrelHumidity = 100 * data[2] / (pow(2, 16) - 1);alue
		crc = bufread[5];//Checksum CRC
	}
	else if(selector == 'T'){
		MSB_raw = bufread[0];
		LSB_raw = bufread[1];
		MSB = (0x0000 | bufread[0]) << 8;
		LSB = (0x0000 | bufread[1]);
		raw = (MSB | LSB); // raw value
		crc = bufread[2];//Checksum CRC
	}
		_data[0] = MSB_raw;
		_data[1] = LSB_raw;
		_data[2] = raw;
		_data[3] = crc;

	return(1);
}

//calculate checksum
int getSHT30checksum(int data[], int nbrOfBytes){
	uint8_t bit;	// bit mask
	uint8_t crc = 0xFF; //calculated checksum
	uint8_t byteCtr; //byte counter

	for(byteCtr = 0; byteCtr < nbrOfBytes; byteCtr++){
		crc = crc ^ (data[byteCtr]);
		for(bit = 8; bit > 0; --bit){
			if(crc & 0x80) crc = (crc << 1) ^ POLYNOMIAL;
			else 		   crc = (crc << 1);
		}
	}
	return crc;
}

void setSHT30_softreset(int I2Caddr){
	//Soft reset
	int CMD_SOFT_RESET = 0x30A2;
	uint8_t MSB, LSB;
	MSB = CMD_SOFT_RESET >> 8;
	LSB = CMD_SOFT_RESET;
	unsigned char buf[2];
	int file;
	// set single shot mode
	buf[0] = MSB;
	buf[1] = LSB;
	file = i2c_open(I2C1_path, I2Caddr);
	i2c_write(file, buf, 2);
	i2c_close(file);
	usleep(200000);
}

void setSHT30_heater(int I2Caddr, unsigned char selector){
	int CMD_ENABLE_HEATER = 0x306D;
	int CMD_DISABLE_HEATER = 0x3066;
	uint8_t MSB, LSB;

	if (selector == 'E'){
		MSB = CMD_ENABLE_HEATER >> 8;
		LSB = CMD_ENABLE_HEATER;
		unsigned char buf[2];
		int file;
		buf[0] = MSB;
		buf[1] = LSB;
		file = i2c_open(I2C1_path, I2Caddr);
		i2c_write(file, buf, 2);
		i2c_close(file);
	}
	else if (selector == 'D'){
		MSB = CMD_DISABLE_HEATER >> 8;
		LSB = CMD_DISABLE_HEATER;
		unsigned char buf[2];
		int file;
		buf[0] = MSB;
		buf[1] = LSB;
		file = i2c_open(I2C1_path, I2Caddr);
		i2c_write(file, buf, 2);
		i2c_close(file);
	}
	usleep(100000);
}

int getSHT30_status_register(unsigned int *_data, int I2Caddr){
	unsigned char buf[2];
	unsigned char bufread[6];
	int file;
	int CMD_READ_STATUS_REGISTER = 0xF32D;
	uint8_t MSB, LSB;
	MSB = CMD_READ_STATUS_REGISTER >> 8;
	LSB = CMD_READ_STATUS_REGISTER;
	buf[0] = MSB;
	buf[1] = LSB;
	file = i2c_open(I2C1_path, I2Caddr);
	i2c_write(file, buf, 2);
	usleep(100000);
	//read conversion reg
	i2c_read(file, bufread, 3);
	i2c_close(file);

	//evaluate following
	//bit 15 => pending alerts (0 = non, 1 = yes)
	//bit 13 => heater status (0 = OFF, 1 = ON)
	//bit 11 => RH tracking alert (0 = no, 1 = yes)
	//bit 10 => T tracking alert (0 = no, 1 = yes)
	//bit 4 => System Reset detected (0 = no, 1 = yes)
	//bit 1 => command status (0 = last command exec. successfull, 1 = last command not processed)
	//bit 0 => write data checksum status (0 = correct, 1 = failed)
	_data[0] = (bufread[1] & 0b00000001);
	_data[1] = (bufread[1] & 0b00000010) >> 1;
	_data[4] = (bufread[1] & 0b00001000) >> 3;
	_data[10] = (bufread[0] & 0b00000100) >> 2;
	_data[11] = (bufread[0] & 0b00001000) >> 3;
	_data[13] = (bufread[0] & 0b00100000) >> 5;
	_data[15] = (bufread[0] & 0b10000000) >> 7;
	//As 16bit value
	_data[16] = ((0x0000 | bufread[0]) << 8) | bufread[1];

	return (1);
}

void setSHT30_clear_status_register(int I2Caddr){
	int CMD_CLEAR_STATUS_REGISTER = 0x3041;
	uint8_t MSB, LSB;

	MSB = CMD_CLEAR_STATUS_REGISTER >> 8;
	LSB = CMD_CLEAR_STATUS_REGISTER;
	unsigned char buf[2];
	int file;
	buf[0] = MSB;
	buf[1] = LSB;
	file = i2c_open(I2C1_path, I2Caddr);
	i2c_write(file, buf, 2);
	i2c_close(file);
	usleep(100000);
}



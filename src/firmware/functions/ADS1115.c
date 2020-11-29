/*
 * ADS1115.c
 *
 *  Created on: 15.07.2020
 *      Author: Johannes Strasser
 *      www.strasys.at
 */

#include <stdio.h>
#include <stdlib.h>
#include <errno.h>
#include <string.h>
#include <unistd.h>
#include "I2C-handler.h"
#include "ADS1115.h"

int configMSB16 = 0b00000010;
int configLSB16 = 0b10000011;
int pointConfigReg16 = 0b00000001;
int pointConversReg16 = 0b00000000;
int MSB16, LSB16;

void initADS1115(int I2Caddr) {
	int file;
		unsigned char buf[3];
		buf[0] = 0b00000001; //point to config register.
		buf[1] = 0b00000010; //MSB config reg bit 11:9 = 001 = max. 4.096V; bit 8 0 = continuous conversion
		buf[2] = 0b10000011; //LSB bit 7:5 = 100 = 1600SPS; bit 4 = 0 comparator mode with hysteresis; bit 3 = 0 (= activ low of ALERT/RDY pin)
							 //bit 2 = 0 (= non latching comperator); bit 1:0 = 11 (= disable comparator) ALERT pin is high.
		file = i2c_open(I2C1_path, I2Caddr);
		i2c_write_byte(file, buf[0]);
		i2c_write_byte(file, buf[1]);
		i2c_write_byte(file, buf[2]);
		//printf("AOUT Number of bytes written: %d\n", numByte);
		i2c_close(file);
}

int getADC16PT1000singleval(int channel, int I2Caddr) {
	int file;
	int AIN0 = 0b01000000; //single input
	int AIN1 = 0b01010000;
	int AIN2 = 0b01100000;
	int AIN3 = 0b01110000;
	int activeChannel;
	int AINval;
	unsigned char buf[3];

	switch (channel){
	case 0:
		activeChannel = AIN0;
		break;
	case 1:
		activeChannel = AIN1;
		break;
	case 2:
		activeChannel = AIN2;
		break;
	case 3:
		activeChannel = AIN3;
		break;
	}

// set config reg to desired channel
	buf[0] = pointConfigReg16;
	buf[1] = configMSB16 | activeChannel;
	buf[2] = configLSB16;
	file = i2c_open(I2C1_path, I2Caddr);
	i2c_write(file, buf, 3);
	//usleep(1000);
// point to conversion reg
	buf[0] = pointConversReg16;
	i2c_write(file, buf, 1);
//read conversion reg
	i2c_read(file, buf, 2);
	i2c_close(file);

	MSB16 = (0x00000000 | buf[0]) << 8;
	LSB16 = (0x00000000 | buf[1]) >> 8;
	AINval = (MSB16 | LSB16);
	return AINval;
}

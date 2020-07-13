/*
 * 24AA256-EEPROM.c
 *
 *  Created on: 03.01.2015
 *      Author: Johannes Strasser
 */

#include <stdio.h>
#include <stdlib.h>
#include <errno.h>
#include <string.h>
#include "I2C-handler.h"
#include "24AA256-EEPROM.h"

//Only i2c-1 needs to be unbind, since this is forseen to be auto loaded
//at start up for beaglebone environment.
//The addressdec is the decimal number 0x54 => 54
void EEPROMinit(int I2Cchannel, int addressdec) {
	char I2CBusDir[255] = { };
	FILE *f;
	sprintf(I2CBusDir,
			"/sys/devices/platform/ocp/4819c000.i2c/i2c-%i/%i-00%i/driver/unbind",
			I2Cchannel, I2Cchannel, addressdec);
	f = fopen(I2CBusDir, "w");
	if (f != 0) {
		fprintf(f, "%i-00%i", I2Cchannel, addressdec);
		fclose(f);
	} else {
		fprintf(stderr, "EEPROMinit: %s\n", strerror(errno));
	}

}

//Write Block needs some additional addresses
int EEPROMwriteblock64(unsigned int EEPROMregister, int EEPROMaddr, unsigned char I2Cchannel ,char *EEPROMdata) {
	int f, i;
	unsigned int length;
	unsigned char buf[255] = { };
	char bufdata[255] = { };

	length = strlen(EEPROMdata);
	printf("length EEPROMdata = %i\n", length);
	if (length <= 64) {

		//split EEPROMregister address in two bytes
		//low byte 8 bit high byte 7 bit
		buf[0] = (EEPROMregister >> 8) & 0xFF;
		buf[1] = EEPROMregister & 0xFF;

		sprintf(bufdata, "%c%c%s", buf[0], buf[1], EEPROMdata);

		for (i = 2; i <= (length + 2); i++) {
			buf[i] = bufdata[i];
		}

		f = i2c_open(I2Cchannel, EEPROMaddr);
		i2c_write(f, buf, (length + 2));
		i2c_close(f);
	} else {
		fprintf(stderr,
				"EEPROMwriteblock64; Number of byte bigger than 64! : %s\n",
				strerror(errno));
		return (-1);
	}
	return 0;
}

int EEPROMwritebyte(unsigned int EEPROMregister, int EEPROMaddr, unsigned char I2Cchannel, char EEPROMdata) {
	int f, length, writenumberbyte;
	unsigned char buf[255] = { };
//	char bufdata[255] = { };
	length = sizeof(EEPROMdata);

	if (length == 1) {
		//split EEPROMregister address in two bytes
		//low byte 8 bit high byte 7 bit
		buf[0] = (EEPROMregister >> 8) & 0xFF;
		buf[1] = EEPROMregister & 0xFF;
		//for (i = 2; i <= sizeof(bufdata); i++) {
			buf[2] = EEPROMdata;
	//	}
		f = i2c_open(I2Cchannel, EEPROMaddr);
		writenumberbyte = i2c_write(f, buf, length + 2);
		if (writenumberbyte == 3){
			i2c_close(f);
		}
		else {
			fprintf(stderr, "Data not fully transfered: %s\n",strerror(errno));
		}
	} else {
		fprintf(stderr, "EEPROMwritebyte; Number of byte > or < than 1 : %s\n",
				strerror(errno));
		return (-1);
	}

	return 0;
}
void EEPROMreadbytes(unsigned int EEPROMregister, char *EEPROMdata, int EEPROMaddr, unsigned char I2Cchannel, unsigned int length) {
	int f, i;
	unsigned char buf[255] = { };
	char bufdata[255] = { };
	//split EEPROMregister address in two bytes
	//low byte 8 bit high byte 7 bit

	buf[0] = (EEPROMregister >> 8) & 0xFF;
	buf[1] = EEPROMregister & 0xFF;
	sprintf(bufdata, "%c%c", buf[0], buf[1]);

	for (i = 0; i <= sizeof(bufdata); i++) {
		buf[i] = bufdata[i];
	}

	f = i2c_open(I2Cchannel, EEPROMaddr);
	i2c_write(f, buf, 2);
	i2c_read(f, buf, length);
	i2c_close(f);

	for (i = 0; i <= (sizeof(buf)); i++) {
		EEPROMdata[i] = buf[i];
	}
}


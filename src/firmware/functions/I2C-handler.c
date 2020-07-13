/*
 * I2C-handler.c
 *
 *  Created on: 02.10.2014
 *      Author: Johannes Strasser
 *
 *   Basic I2C - Handling functions.
 *   Specially designed for the BBB
 */

#include <stdio.h>
#include <linux/i2c.h>
#include <linux/i2c-dev.h>
#include <sys/ioctl.h>
#include <fcntl.h>
#include <unistd.h>
#include <errno.h>
#include <time.h>
#include <string.h>

#include "I2C-handler.h"
// devices on i2c2 = naming on pin description
int addr_EEPROMmain = 0b01010100;  // = 0x54 I2C address of the 24AA256-EEPROM
int addr_EEPROMex1 = 0b01010000;		// = 0x50 I2C address
int addr_EEPROMex2 = 0b01010001;		// = 0x51 I2C address
int addr_EEPROMex3 = 0b01010010;		// = 0x52 I2C address
int addr_EEPROMex4 = 0b01010011;		// = 0x53 I2C address
//Devices on i2c1 = naming on Pin description
int addr_ADC_ADS1015 = 0b1001000; // = 0x48 I2C address of the ADS1015 ADC for PT1000
int addr_RTC_MCP7940N = 0b01101111;  // = 0x6F I2C address of the RTC (MCP7940N)
int addr_AOUT_LTC2635 = 0b0010000; // = 0x10 I2C address of the Analog Out (AOUT) LTC2635

int i2c_open(unsigned char bus, unsigned char addr) {
	int file;
	char filename[16];
	sprintf(filename, "/dev/i2c-%d", bus);
	if ((file = open(filename, O_RDWR)) < 0) {
		fprintf(stderr, "i2c_open open error: %s\n", strerror(errno));
		return (file);
	}
	if (ioctl(file, I2C_SLAVE, addr) < 0) {
		fprintf(stderr, "i2c_open ioctl error: %s\n", strerror(errno));
		return (-1);
	}
	return (file);
}

int i2c_write(int handle, unsigned char *buf, unsigned int length) {

	if (write(handle, buf, length) != length) {
		fprintf(stderr, "i2c_write error: %s\n", strerror(errno));
		return (-1);
	}
	return (length);
}

int i2c_write_byte(int handle, unsigned char val) {
	if (write(handle, &val, 1) != 1) {
		fprintf(stderr, "i2c_write_byte error: %s\n", strerror(errno));
		return (-1);
	}
	return (1);
}

int i2c_read(int handle, unsigned char *buf, unsigned int length) {
	if (read(handle, buf, length) != length) {
		fprintf(stderr, "i2c_read error: %s\n", strerror(errno));
		return (-1);
	}
	return (length);
}

int i2c_read_byte(int handle, unsigned char *val) {
	if (read(handle, val, 1) != 1) {
		fprintf(stderr, "i2c_read_byte error: %s\n", strerror(errno));
		return (-1);
	}
	return (1);
}

int i2c_close(int handle) {
	if ((close(handle)) != 0) {
		fprintf(stderr, "i2c_close error: %s\n", strerror(errno));
		return (-1);
	}
	return (0);
}


/*
 * I2C-handler.h
 *
 *  Created on: 02.10.2014
 *      Author: Johannes Strasser
 */

#ifndef I2C_HANDLER_H_
#define I2C_HANDLER_H_

#define I2C2_path 2 	//"/dev/i2c-2" i2c-2
#define I2C1_path 1		//"/dev/i2c-1" i2c-1
// TODO rename
// participants on i2c2
extern int addr_EEPROMmain;		// = 0x54 I2C address of the EEPROM (Cap 1)
extern int addr_EEPROMex1;		// = 0x54 I2C address on I2C2 extension slot 2 EL-100-020-001
extern int addr_EEPROMex2;		// = 0x55 I2C address on I2C2 extension slot 2 EL-100-020-001
extern int addr_EEPROMex3;		// = 0x56 I2C address on I2C2 extension slot 2 EL-100-020-001
extern int addr_EEPROMex4;		// = 0x57 I2C address on I2C2 extension slot 2 EL-100-020-001

// participants on i2c1
extern int addr_ADC_ADS1015; 	// = 0x48 I2C address of ADC for PT1000
extern int addr_RTC_MCP7940N;   // = 0x6F I2C address of the RTC (MCP7940N)
extern int addr_AOUT_LTC2635; // = 0x20 I2C address of the Analog Out (AOUT) LTC2635

//bus 1 = I2C2 at BBB
int i2c_open(unsigned char bus, unsigned char addr);

// These functions return -1 on error, otherwise return the number of bytes read/written.
int i2c_write(int handle, unsigned char *buf, unsigned int length);
int i2c_read(int handle, unsigned char *buf, unsigned int length);

int i2c_write_byte(int handle, unsigned char val);
int i2c_read_byte(int handle, unsigned char *val);

// These functions return -1 on error, otherwise return 0 on success
int i2c_close(int handle);
#endif /* I2C_HANDLER_H_ */

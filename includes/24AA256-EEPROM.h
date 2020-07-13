/*
 * 24AA256-EEPROM.h
 *
 *  Created on: 03.01.2015
 *      Author: Johannes Strasser
 */

#ifndef SRC_FUNCTIONS_24AA256_EEPROM_H_
#define SRC_FUNCTIONS_24AA256_EEPROM_H_

//This function writes max 64 bytes to the EEPROM
//if there are more than 64 data bytes then the
//it is defined by the EEPROM to continue with the first
//byte if there are more than 64 bytes send.
//
void EEPROMinit(int I2Cchannel, int address);
int EEPROMwriteblock64(unsigned int EEPROMregister, int EEPROMaddr, unsigned char I2Cchannel, char *EEPROMdata);
int EEPROMwritebyte(unsigned int EEPROMregister, int EEPROMaddr, unsigned char I2Cchannel, char EEPROMdata);
void EEPROMreadbytes(unsigned int EEPROMregister, char *EEPROMdata, int EEPROMaddr, unsigned char I2Cchannel, unsigned int length);
#endif /* SRC_FUNCTIONS_24AA256_EEPROM_H_ */

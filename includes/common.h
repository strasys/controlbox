/*
 * common.h
 *
 *  Created on: 18.10.2014
 *      Author: Franz Mauch
 */

#ifndef COMMON_H_
#define COMMON_H_

#include "I2C-handler.h"
#include "RTC_MCP7940N.h"

// struct for all in data from the board
typedef struct {
	// for each type of parameter rtc,gpio,temperatur... one struct
	RTC rtc;
// gpio
// temperature
// ...
} ALL_in;

// semaphore operations
int lock_bb();
int unlock_bb();

// get the dat from the bbb and save it to file
int transfer_from_bb_to_file(void);
// load the last saved file
int getDataFromFile(ALL_in *p_data);

// for each type of input to bb one function
int set_rtc_bb(RTC rtc);
int set_gpio(int line, int value);

#endif /* COMMON_H_ */

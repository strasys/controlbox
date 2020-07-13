/*
0 * AINOUThandler.c
 *
 *  Created on: 01.04.2015
 *      Author: Johannes Strasser
 */

#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <unistd.h>
#include <AOUT_LTC2635.h>
#include <AIN-handler.h>
#include "24AA256-EEPROM.h"
#include "I2C-handler.h"

/*
 * Function documentation:
 * get Analog IN value: AINOUThandler g (=get) I (=Input) 1 (=Channel number)
 * set Analog OUT value: AINOUThandler s (=set) O (=Output) 1 (=Channel number) 0:1023 (= Output value)
 */

void getbusaddrExt(int extno, unsigned int *busaddr){

	unsigned int regreadstart = 256;
	unsigned int regreadnumberbyte = 64;
	char extaddrEEPROM_temp[64], eepromdata[255];
	int extaddrEEPROM[4];
	int i = 0;
		for (i=0; i<4; i++){
			EEPROMreadbytes(regreadstart, eepromdata, addr_EEPROMmain, I2C2_path, regreadnumberbyte);
			char tempstring[70];
			strcpy(tempstring, eepromdata);
			const char delimiters[] = " :";
			strtok(tempstring, delimiters);
			strncpy(extaddrEEPROM_temp, strtok(NULL, delimiters), 2);
			extaddrEEPROM[i] = strtol(extaddrEEPROM_temp, NULL, 16);
			regreadstart += 64;
			//only for debug
			//printf("extension %i: %i\n", i, extaddrEEPROM[i]);
		}

		switch(extno){
		case 1:
			busaddr[0] = extaddrEEPROM[0];
			break;
		case 2:
			busaddr[0] = extaddrEEPROM[1];
			break;
		case 3:
			busaddr[0] = extaddrEEPROM[2];
			break;
		case 4:
			busaddr[0] = extaddrEEPROM[3];
			break;
		}
		//init_AOUT(busaddr[0]);
}

int main(int argc, char *argv[], char *env[]){
	int channel, AINvalue, AOUTvalue, extno;


	//read in arguments
	int i;
	char input[6];
		for (i=1;i<argc;i++){
			sscanf(argv[i],"%c",&input[i]);
		}

	switch (input[1]){
	case 'h':
		printf("Description of function AINOUThandler handler:\n"
				"AINOUThandler [g,s] [I,O] [channel] Option[AOUT-value] [Hardware extension]\n"
				"	g => get\n"
				"	h => help\n"
				"   I => Analog IN\n"
				"   O => Analog OUT\n"
				"	channel => integer Number from 1 ... 4\n"
				"	hw extension => integer 1 - 4\n\n");
		break;
	case 'g':
		switch (input[2]){
		case 'I':
			channel = atoi(argv[3]);
			AINvalue = get_iio_value_n(channel);
			printf("%i\n", AINvalue);
			break;
		case 'O':
			channel = atoi(argv[3]);
			extno = atoi(argv[4]);
			unsigned int busaddrext[1];
			getbusaddrExt(extno, busaddrext);
			AOUTvalue = AOUT_get_value_DACn(channel,busaddrext[0]);
			printf("%i\n", AOUTvalue);
			break;
		default:
			printf("Check your entry. \n Help: extension h\n");
			break;
		}
		break;
	case 's':
		switch (input[2]){
		case 'O':
			channel = atoi(argv[3]);
			AOUTvalue = atoi(argv[4]);
			extno = atoi(argv[5]);
			unsigned int busaddrext[1];
			getbusaddrExt(extno, busaddrext);
			AOUT_set_value_DACn(channel, AOUTvalue, busaddrext[0]);
			break;
		default:
			printf("Check your entry. \n Help: extension h\n");
			break;
		}
		break;
	default:
		printf("Check your entry. \n Help: extension h\n");
		break;
	}
return 0;
}

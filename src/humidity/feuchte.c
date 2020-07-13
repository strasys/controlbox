/*
 * feuchte.c
 *
 *  Created on: 05.03.2018
 *      Author: Johannes Strasser
 *      www.strasys.at
 */

#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <unistd.h>
#include <errno.h>
#include <math.h>
#include "SHT30.h"
#include "24AA256-EEPROM.h"
#include "I2C-handler.h"

int getI2Cadress(int extno){
	char eepromdata[255];
	unsigned int regreadstart = 256;
	unsigned int regreadnumberbyte = 64;
	char extaddrEEPROM_temp[64];
	int busaddrext;
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
						busaddrext = extaddrEEPROM[0];
					break;
				case 2:
						busaddrext = extaddrEEPROM[1];
					break;
				case 3:
						busaddrext = extaddrEEPROM[2];
					break;
				case 4:
						busaddrext = extaddrEEPROM[3];
					break;
			}
	return busaddrext;
}

int main(int argc, char *argv[], char *env[]){
	char input[3];
	int i, busaddrext, extno;

	//read in arguments
	for (i=1;i<argc;i++){
		sscanf(argv[i],"%c",&input[i]);
	}

	switch (input[1]){
	case 'h':
		printf("Description of function feuchte :\n"
				"feuchte [g, h, s] [F, T-C, T-F, H-E, H-D, R] [Hardware extension]\n"
				"	g => get\n"
				"	s => set\n"
				"	h => help\n"
				"	F => Feuchte in proz rel Feuchte\n"
				"	T-C => Temperatur in °C\n"
				"	T-F => Temperatur in °F\n"
				"	H-E => Heater Enable\n"
				"	H-D => Heater Disable\n"
				"	R-T => read status register => Ausgabe Text\n"
				"	R-I => read status register => Ausgabe als 16 bit Hex\n"
				"	hw extension => integer 1 - 4\n"
				"example - get Temperatur in °C:\n "
				"	feuchte g T-C 2\n"
				"example - set Heater EIN:\n"
				"	feuchte s H-E 2\n"
				"example - get read status register a Text:\n"
				"	feuchte g R-T 2\n"
				"example - set (clear) status register:\n"
				"	feuchte s R 2\n"
				"\n");
		break;
	case 'g':
		if (argc != 4) {
			fprintf(stderr, "feuche: missing argument! => %s\n", strerror(errno));
		} else {
			extno = atoi(argv[3]);

			//get I2C devices address
			busaddrext = getI2Cadress(extno);

		//Split input 2
		char selector_str[3];
		char selector[2];
		char *selector_temp;
		strcpy(selector_str, argv[2]);
		if (strlen(selector_str)==3){
			const char delimiters[] = "-";
			selector_temp = strtok(selector_str, delimiters);
			selector[0] = selector_temp[0];
			selector_temp =  strtok(NULL, delimiters);
			selector[1] = selector_temp[0];
		}
		else if (strlen(selector_str)==1){
			selector[0] = input[2];
		}
		else {
			fprintf(stderr, "feuchte: arguments missmatch => %s\n", strerror(errno));
			exit(1);
		}
		unsigned int data_R[17];
			switch (selector[0]){
			case 'F':
				//print results
				printf("%.0f\n",getSHT30single_humidity(busaddrext));
				break;
			case 'T':
				printf("%.1f\n",getSHT30single_temperature(selector[1], busaddrext));
				break;
			case 'R':
				getSHT30_status_register(data_R, busaddrext);
				if (selector[1] == 'T'){
					printf("Write data checksum status: %i\n"
						"Command status: %i\n"
						"System reset detected: %i\n"
						"T tracking alert: %i\n"
						"RH tracking alert: %i\n"
						"Heater status: %i\n"
						"Alert pending status: %i\n", data_R[0], data_R[1],
						data_R[4], data_R[10], data_R[11], data_R[13], data_R[15]);
				}
				else if (selector[1] == 'I'){
					printf("%02x\n", data_R[16]);
				}
				break;
			}
		}
		break;
	case 's':
		if (argc != 4) {
					fprintf(stderr, "feuchte: missing argument! => %s\n", strerror(errno));
		} else {
			extno = atoi(argv[3]);

			//get I2C devices address
			int busaddrext = getI2Cadress(extno);
			//Split input 2
			char selector_str[3];
			unsigned char selector[2];
			char *selector_temp;
			strcpy(selector_str, argv[2]);

			if (strlen(selector_str)==3){
				const char delimiters[] = "-";
				selector_temp = strtok(selector_str, delimiters);
				selector[0] = selector_temp[0];
				selector_temp =  strtok(NULL, delimiters);
				selector[1] = selector_temp[0];
			}
			else if (strlen(selector_str)==1)
			{
				selector[0] = input[2];
			}
			else
			{
				fprintf(stderr, "feuchte: arguments missmatch => %s\n", strerror(errno));
				exit(1);
			}

			switch (selector[0]){
			case 'H':
				setSHT30_heater(busaddrext, selector[1]);
				break;
			case 'R':
				setSHT30_clear_status_register(busaddrext);
				break;
			}
		}
		break;
	default:
		printf("Wrong arguments!\n"
				"Try feuchte h\n");
		break;
	}

		return 0;
}

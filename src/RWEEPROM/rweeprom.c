/*
 * rweeprom.c
 *
 *  Created on: 13.02.2016
 *  Author: Johannes Strasser
 *  Handler to read and write EEPROM
 */

#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <unistd.h>
#include <errno.h>
#include "24AA256-EEPROM.h"
#include "I2C-handler.h"


int main(int argc, char *argv[], char *env[]){


	char input[1], busnumchar[1];
	char startregchar[6];
	char extensionchar[1];
	char numberbytes[3];
	char eepromdata[255] = {0};
	char datatoeeprom[65] = {0};
	int EEPROMaddr;
	unsigned int startregint, numbytes, extensionNum, busnumint, I2Cchannel;


	//read in argument
		sscanf(argv[1],"%c",&input[0]);

	switch (input[0]){
	case 'h':
		printf("Description of function rweeprom:\n"
				"rweeprom [i,r,w][int extension] [int start / int end]  [char \"string which shall be written\"]\n"
				"		max length of chars = 255\n"
				"	i : init, only for mainboard ram (=0x54) \n"
				"	r : read, int 1 = I2C-1  / 2 = I2c-2, int extension number (1,2,3,4,5=EEPROM Mainboard)\n "
				"		int start reg. no., int number of bytes max. 255\n"
				"	w : write, int I2C-1  / I2c-2, int extension number (1,2,3,4,5=EEPROM Mainboard)\n"
				"		int start reg. no., string content max. length 64\n");
		break;
	case 'i':
		if (argc != 2) {
			fprintf(stderr, "rweeprom: missing argument! => %s\n", strerror(errno));
		} else {
			EEPROMinit(2,54);
		}
		break;
	case 'r':
		if (argc !=6) {
			fprintf(stderr, "rweeprom: missing argument! => %s\n", strerror(errno));
		} else {
			if (strlen(argv[2]) >1){
				fprintf(stderr, "%s is too long!\n", strerror(errno));
			}
			else
			{
				strcpy(busnumchar, argv[2]);
				busnumint = atoi(busnumchar);
				switch(busnumint){
					case 1:
						I2Cchannel = I2C1_path;
						break;
					case 2:
						I2Cchannel = I2C2_path;
						break;
					default:
						fprintf(stderr, "%s Only I2C-1 and I2C-2 can be chosen!\n", strerror(errno));
						break;
					}
			}

			if (strlen(argv[3]) > 1){
				fprintf(stderr, "%s is too long!\n", strerror(errno));
			}
			else
			{
				strcpy(extensionchar, argv[3]);
				extensionNum = atoi(extensionchar);
				switch(extensionNum){
					case 1:
						EEPROMaddr = addr_EEPROMex1;
						break;
					case 2:
						EEPROMaddr = addr_EEPROMex2;
						break;
					case 3:
						EEPROMaddr = addr_EEPROMex3;
						break;
					case 4:
						EEPROMaddr = addr_EEPROMex4;
						break;
					case 5:
						EEPROMaddr = addr_EEPROMmain;
						break;
					default:
						fprintf(stderr, "%s Only extension numbers from 1 to 4 are allowed!\n", strerror(errno));
						break;
					}
			}

			if (strlen(argv[4]) > 6){
				fprintf(stderr, "%s is too long!\n", strerror(errno));
			}
			else
			{
				strcpy(startregchar, argv[4]);
				startregint = atoi(startregchar);
			}

			if (strlen(argv[5]) > 3){
				fprintf(stderr, "%s is too long!", strerror(errno));
			}
			else
			{
				strcpy(numberbytes, argv[5]);
				numbytes = atoi(numberbytes);
				if (numbytes > 255){
					fprintf(stderr, "%s is to larg (max 255)!", strerror(errno));
				}
			}
			//EEPROMreadbytes(unsigned int EEPROMregister, char *EEPROMdata, unsigned int length)
			EEPROMreadbytes(startregint, eepromdata, EEPROMaddr, I2Cchannel, numbytes);
			printf("%s\n",eepromdata);
		}
		break;
	case 'w':
		if (argc !=6) {
			fprintf(stderr, "rweeprom: missing argument! => %s\n", strerror(errno));
		} else {

			if (strlen(argv[2]) >1){
				fprintf(stderr, "%s is too long!\n", strerror(errno));
			}
			else
			{
				strcpy(busnumchar, argv[2]);
				busnumint = atoi(busnumchar);
				switch(busnumint){
					case 1:
						I2Cchannel = I2C1_path;
						break;
					case 2:
						I2Cchannel = I2C2_path;
						break;
					default:
						fprintf(stderr, "%s Only I2C-1 and I2C-2 can be chosen!\n", strerror(errno));
						break;
				}
			}


			if (strlen(argv[3]) > 1){
				fprintf(stderr, "%s is too long!\n", strerror(errno));
			}
			else
			{
				strcpy(extensionchar, argv[3]);
				extensionNum = atoi(extensionchar);
				switch(extensionNum){
					case 1:
						EEPROMaddr = addr_EEPROMex1;
						break;
					case 2:
						EEPROMaddr = addr_EEPROMex2;
						break;
					case 3:
						EEPROMaddr = addr_EEPROMex3;
						break;
					case 4:
						EEPROMaddr = addr_EEPROMex4;
						break;
					case 5:
						EEPROMaddr = addr_EEPROMmain;
						break;
					default:
						fprintf(stderr, "%s Only extension numbers from 1 to 4 are allowed!\n", strerror(errno));
						break;
				}
			}
			if (strlen(argv[4]) > 6){
				fprintf(stderr, "%s is too long!\n", strerror(errno));
			}
			else
			{
				strcpy(startregchar, argv[4]);
				startregint = atoi(startregchar);
			}
			if (strlen(argv[5]) > 64){
				fprintf(stderr, "%s is too long!", strerror(errno));
			}
			else
			{
				strcpy(datatoeeprom,argv[5]);
			}
			//EEPROMwriteblock64(unsigned int EEPROMregister, char *EEPROMdata)
			EEPROMwriteblock64(startregint, EEPROMaddr, I2Cchannel, datatoeeprom);
		}
		break;
	default:
		printf("Wrong arguments!\n"
				"try rweeprom h\n");
		break;
	}

		return 0;

}

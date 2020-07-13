/*
 * AOUT_LTC2635.c
 *
 *  Created on: 01.11.2014
 *      Author: Johannes Strasser
 *
 *
 */

#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <unistd.h>
#include <errno.h>
#include <fcntl.h>
#include "I2C-handler.h"
#include "AOUT_LTC2635.h"
#include "accessorg.h"



int dacOUT1addr = 0b00000000;	//The last 4 bits describe the address codes
int dacOUT2addr = 0b00000001;
int dacOUT3addr = 0b00000010;
int dacOUT4addr = 0b00000011;
int dacALLaddr = 0b00001111;

int dacOUT1 = 1;
int dacOUT2 = 2;
int dacOUT3 = 3;
int dacOUT4 = 4;

void init_AOUT(unsigned int addr_AOUT) {
	char fopenModus[2] = {};
	FILE *f = NULL;
	char username[255];
	long int uidresult[] = {0};
	long int gidresult[] = {0};
	long int uidowner[] = {0};
	long int gidowner[] = {0};
	long int fileprotection[] = {0};
	int filedesc;

	AOUT_set_internal_reference(addr_AOUT);
	//For the first call the txt file will be generated with val = 0
	char DIR[255];
	sprintf(DIR,"%s%i.txt",AOUT_DIR,addr_AOUT);
	if (access(DIR, (R_OK | W_OK)) != -1) {
				sprintf(fopenModus, "r+");
			} else {
				sprintf(fopenModus, "w");
			}

		f = fopen(DIR, fopenModus);
		fprintf(f,
				"AOUT1=%4i:AOUT2=%4i:AOUT3=%4i:AOUT4=%4i",
				0, 0, 0, 0);
		fclose(f);

	// Check if file has the defined uid (user ID) and gid (group ID)!
			filedesc = open(DIR, O_RDWR);

			getinfofile(&filedesc, uidowner, gidowner, fileprotection);

		//	printf("getinfofile call: \n uidowner : %li\n gidowner : %li\n fileprotection : %lo\n", uidowner[0], gidowner[0], fileprotection[0]);
			strcpy(username, uid_Name);
			getuidbyname(username, uidresult, gidresult);

		//	printf("Result of function call:\n uid : %li\n gid : %li\n", uidresult[0], gidresult[0]);

			if ((uidowner[0] != uidresult[0]) || (gidowner[0] != gidresult[0])){
				if ((fchown(filedesc, uidresult[0], gidresult[0])) != 0){
					fprintf(stderr, "%s\n", strerror(errno));
				}
			}

			close(filedesc);

	AOUT_set_value_DACn(dacOUT1, 0, addr_AOUT);
	AOUT_set_value_DACn(dacOUT2, 0, addr_AOUT);
	AOUT_set_value_DACn(dacOUT3, 0, addr_AOUT);
	AOUT_set_value_DACn(dacOUT4, 0, addr_AOUT);
}
//This set's the internal reference of the Digital
//to Analog converter.
//For that chip the internal ref. is 2,5 V

void AOUT_set_internal_reference(unsigned int addr_AOUT) {
	int file;
	unsigned char buf[3];
	buf[0] = 0b01101111; //The first 4 bit in byte 1 are relevant to set to internal reference.
	buf[1] = 0;
	buf[2] = 0;
	file = i2c_open(I2C1_path, addr_AOUT);
	i2c_write(file, buf, 3);
	//printf("AOUT Number of bytes written: %d\n", numByte);
	i2c_close(file);
}

// DACchannel is DAC_A or DAC_B

void AOUT_set_value_DACn(int DACchl, int value, unsigned int addr_AOUT) {
	int file;
	unsigned char buf[3];
	buf[0] = 0b00110000; //The first 4 bits COMMAND = Write to and Update (Power Up) DAC Register n.
	buf[1] = 0;
	buf[2] = 0;

	switch (DACchl){
	case 1:
		buf[0] = buf[0] | dacOUT1addr;
		AOUT_write_value_DACn(1,value, addr_AOUT);
		break;
	case 2:
		buf[0] = buf[0] | dacOUT2addr;
		AOUT_write_value_DACn(2,value, addr_AOUT);
		break;
	case 3:
		buf[0] = buf[0] | dacOUT3addr;
		AOUT_write_value_DACn(3,value, addr_AOUT);
		break;
	case 4:
		buf[0] = buf[0] | dacOUT4addr;
		AOUT_write_value_DACn(4,value, addr_AOUT);
		break;
	}

	if ((value < 0) | (value > 1024)) {
		printf("Error: DAC value < 0 or > 1023\n");
	} else {
		buf[1] = (value >> 2) & 0xFF;
		//printf("buf 1 %x\n",buf[1]);
		buf[2] = (value << 6) & 0xFF;
		//printf("buf 2 %x\n",buf[2]);
	}

	file = i2c_open(I2C1_path, addr_AOUT);
	i2c_write(file, buf, 3);
	//printf("AOUT Number of bytes written: %d\n", numByte);
	i2c_close(file);
}

int AOUT_get_value_DACn(unsigned int channel, unsigned int addr_AOUT) {
	int AOUTn, AOUTval1, AOUTval2, AOUTval3, AOUTval4;
	char DIR_AOUTvalue[255] = {};
	FILE *f = NULL;

		sprintf(DIR_AOUTvalue,"%s%i.txt", AOUT_DIR, addr_AOUT);

		if (access(DIR_AOUTvalue, (R_OK | W_OK)) != -1) {
					f = fopen(DIR_AOUTvalue, "r");
					fscanf(f,
							"AOUT1=%i:AOUT2=%i:AOUT3=%i:AOUT4=%i",
							&AOUTval1, &AOUTval2, &AOUTval3, &AOUTval4);
					fclose(f);
					switch(channel){
					case 1:
						AOUTn = AOUTval1;
						break;
					case 2:
						AOUTn = AOUTval2;
						break;
					case 3:
						AOUTn = AOUTval3;
						break;
					case 4:
						AOUTn = AOUTval4;
						break;
					default:
						fprintf(stderr, "AOUT_get_value_DACn (LTC2635): Channel %i does not exist!\n",channel);
						return -1;
						break;
					}
			} else {
				fprintf(stderr, "AOUT_get_value_DACn (LTC2635): File %s does not exist!\n",DIR_AOUTvalue);
				return -1;
			}
	return (AOUTn);
}

//Since there is no possibility to read the actual set value
//from the LTC2635 it is necessary to store the last set value.
void AOUT_write_value_DACn(int channel, int value, unsigned int addr_AOUT) {
	FILE *f = NULL;
	char DIR_AOUTvalue[255] = {};
	char fopenModus[2] = {};

	sprintf(DIR_AOUTvalue,"%s%i.txt", AOUT_DIR, addr_AOUT);
	//read file to get current set values
	int i = 0, AOUTvals[5];
	for(i=1;i<5;i++){
		AOUTvals[i] = AOUT_get_value_DACn(i,addr_AOUT);
	}


	switch (channel){
	case 1:
		AOUTvals[1] = value;
		break;
	case 2:
		AOUTvals[2]= value;
		break;
	case 3:
		AOUTvals[3] = value;
		break;
	case 4:
		AOUTvals[4] = value;
		break;
	default:
		fprintf(stderr, "AOUT_write_value_DACn (LTC2635): wrong channel number %i\n", channel);
		break;
	}

	//Check if the file exists already.
	if (access(DIR_AOUTvalue, (R_OK | W_OK)) != -1) {
			sprintf(fopenModus, "r+");
		} else {
			sprintf(fopenModus, "w");
		}

	f = fopen(DIR_AOUTvalue, fopenModus);
	fprintf(f,
			"AOUT1=%4i:AOUT2=%4i:AOUT3=%4i:AOUT4=%4i",
			AOUTvals[1], AOUTvals[2], AOUTvals[3], AOUTvals[4]);
	fclose(f);

}


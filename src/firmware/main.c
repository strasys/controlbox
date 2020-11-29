/*
 * main.c
 *
 *  Created on: 27.09.2014
 *  update EL-100-020-001: 11.07.2016
 *      Author: Johannes Strasser
 */


#include <errno.h>
#include <string.h>
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <termios.h>
#include <linux/i2c-dev.h>
#include <sys/ioctl.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <sys/time.h>
#include <fcntl.h>
#include <time.h>
#include "I2C-handler.h"
#include "RTC_MCP7940N.h"
#include "GPIO.h"
#include "AOUT_LTC2635.h"
#include "24AA256-EEPROM.h"
#include "ADS1015.h"



void init(void){

	init_GPIO(3);
	//The mainboard EEPROM must be unbind
	EEPROMinit(2, 54);
	/*
	 * Read mainboard EEPROM - to detect the bus addresses and
	 * devices added to the extension slots.
	 * Than initiate hardware.
	 */
			unsigned int regreadstart = 256;
			unsigned int regreadnumberbyte = 64;
			char extaddrEEPROM_temp[70], extdeviceEEPROM[70], eepromdata[255];
			int extaddrEEPROM;
			int i = 0;

			for (i=0; i<4; i++){
				EEPROMreadbytes(regreadstart, eepromdata, addr_EEPROMmain, I2C2_path, regreadnumberbyte);
				char tempstring[70];
				strcpy(tempstring, eepromdata);
				const char delimiters[] = ":";
				strtok(tempstring, delimiters);
				strcpy(extaddrEEPROM_temp, strtok(NULL, delimiters));
				//printf("str_EEPROM_addr %i: %s\n",i, extaddrEEPROM_temp);
				strcpy(extdeviceEEPROM, strtok(NULL, delimiters));
				//printf("str_EEPROM_device %i: %s\n",i, extdeviceEEPROM);
				if (strcmp(extdeviceEEPROM,"PT1000") == 0){
					extaddrEEPROM = strtol(extaddrEEPROM_temp, NULL, 16);
					//printf("str_EEPROM_address %i: %i\n",i, extaddrEEPROM);
					initADS1015(extaddrEEPROM);
				}
				if (strcmp(extdeviceEEPROM, "AOUT") == 0){
					extaddrEEPROM = strtol(extaddrEEPROM_temp, NULL, 16);
					init_AOUT(extaddrEEPROM);
				}

				regreadstart += 64;
				//only for debug
				//printf("extension %i: %i\n", i, extaddrEEPROM[i]);
			}
}

void getFormatForDate(char * pDateTime) {
	// formats for date -u
	// date --universal $(/www/pages/cgi-bin/RTChandler g f)
	sprintf(pDateTime, "%2.2d%2.2d%2.2d%2.2d%4.4d", RTC_get_month(I2C1_path),
			RTC_get_day(I2C1_path), RTC_get_hours(I2C1_path), RTC_get_minutes(I2C1_path), RTC_get_year(I2C1_path));
}

//read if RTC is set as main clock
//if RTC = 1; => RTC is considered as main clock
void initRTC(void){
	unsigned int regreadstart = 512;
	unsigned int regreadnumberbyte = 64;
	char eepromdata[255], str_status_RTC[10];

	EEPROMreadbytes(regreadstart, eepromdata, addr_EEPROMmain, I2C2_path, regreadnumberbyte);
	char tempstring[70];
	strcpy(tempstring, eepromdata);
	const char delimiters[] = ":";
	strtok(tempstring, delimiters);
	strcpy(str_status_RTC, strtok(NULL, delimiters));

	printf("str_status_RTC: %s\n", str_status_RTC);

	if (strcmp(str_status_RTC, "ON") == 0){
		//time beaglebone with RTC
		//set time on beaglebone according to RTC time
		// at start up.
		init_RTC(I2C1_path);
		char command[128];
		char dateTime[13];
//Read out text file for webAccessStatus
		FILE *f = NULL;
		char DIR_getWebAccess[255] = {};
		char charWebStatus[2] = {};
			char fopenModus[3] = {};
			int flag = 0;

			sprintf(DIR_getWebAccess, "/var/www/tmp/webaccessStatus.txt");

			if (access(DIR_getWebAccess, (R_OK | W_OK)) != -1) {
				sprintf(fopenModus, "r+");
				flag = 0;
			}

			if (flag == 0){
				f = fopen(DIR_getWebAccess, fopenModus);
				fread(charWebStatus,sizeof(charWebStatus),sizeof(charWebStatus),f);
				sprintf(charWebStatus,"%s%s",charWebStatus,"\0");
				fclose(f);
			}
		printf("Web status = %s\n", charWebStatus);

		if (strcmp(charWebStatus,"0") == 0){
			getFormatForDate(dateTime);
			sprintf(command,"date -u %s",dateTime);
			system(command);
		}
		if (strcmp(charWebStatus,"1") == 0){
			//set RTC - clock
			time_t rawtime = time(NULL);
			struct tm *timeinfo;
			timeinfo = gmtime(&rawtime);
			RTC_set_hours(timeinfo->tm_hour,I2C1_path);
			RTC_set_minutes(timeinfo->tm_min,I2C1_path);
			RTC_set_seconds(timeinfo->tm_sec,I2C1_path);
			RTC_set_day(timeinfo->tm_mday,I2C1_path);
			RTC_set_month(timeinfo->tm_mon+1,I2C1_path);
			RTC_set_year(timeinfo->tm_year-100,I2C1_path);
		}
		//error is not a problem yet!!
	}
}

int main(int argc, char *argv[], char *env[])
{

		init();
		initRTC();
		system("php /var/www/set/data_cloud/PushCloudDataTransferService.php");

	return (0);
}


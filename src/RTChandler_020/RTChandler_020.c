/*
 * RTChandler.c
 *
 *  Created on: 08.11.2014
 *      Author: Johannes Strasser
 *
 *This program is supposed to be called from the server
 *to set and read the on board RTC.
 */

#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <unistd.h>
#include "I2C-handler.h"
#include "RTC_MCP7940N.h"

void getFormatForDate(char * pDateTime) {
	// formats for date -u
	// date --universal $(/www/pages/cgi-bin/RTChandler g f)
	sprintf(pDateTime, "%2.2d%2.2d%2.2d%2.2d%4.4d", RTC_get_month(I2C1_path),
			RTC_get_day(I2C1_path), RTC_get_hours(I2C1_path), RTC_get_minutes(I2C1_path), RTC_get_year(I2C1_path));
}

int main(int argc, char *argv[], char *env[]) {
	char setget, timedate;
	char dateTime[13];

	if (argv[1] != 0) {
		sscanf(argv[1], "%c", &setget);
		sscanf(argv[2], "%c", &timedate);
	}

	if (setget == 's') {
		char command[128];
		if (timedate == 't') {
			RTC_set_hours(atoi(argv[3]),I2C1_path);
			RTC_set_minutes(atoi(argv[4]),I2C1_path);
			RTC_set_seconds(atoi(argv[5]),I2C1_path);
		}

		if (timedate == 'd') {
			RTC_set_day(atoi(argv[3]),I2C1_path);
			RTC_set_month(atoi(argv[4]),I2C1_path);
			RTC_set_year(atoi(argv[5]),I2C1_path);
		}
		getFormatForDate(dateTime);
		sprintf(command, "date -u %s", dateTime);
		system(command);
	}

//	if ((setget == 'g')) {
	if (timedate == 'f') {
		getFormatForDate(dateTime);
		printf("%s", dateTime);
	} else {
		printf("%2.2d\n", RTC_get_day(I2C1_path));
		printf("%2.2d\n", RTC_get_month(I2C1_path));
		printf("%4.4d\n", RTC_get_year(I2C1_path));
		printf("%2.2d\n", RTC_get_hours(I2C1_path));
		printf("%2.2d\n", RTC_get_minutes(I2C1_path));
		printf("%2.2d\n", RTC_get_seconds(I2C1_path));
	}
	return 0;
}


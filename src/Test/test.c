
#include <stdio.h>
#include <string.h>
#include <time.h>
#include "I2C-handler.h"
#include "RTC_MCP7940N.h"

int main(int argc, char *argv[], char *env[]){
	time_t rawtime = time(NULL);
	struct tm *timeinfo;
	timeinfo = gmtime(&rawtime);
	RTC_set_hours(timeinfo->tm_hour,I2C1_path);
	RTC_set_minutes(timeinfo->tm_min,I2C1_path);
	RTC_set_seconds(timeinfo->tm_sec,I2C1_path);
	RTC_set_day(timeinfo->tm_mday,I2C1_path);
	RTC_set_month(timeinfo->tm_mon+1,I2C1_path);
	RTC_set_year(timeinfo->tm_year-100,I2C1_path);

	printf("Current time: %2d:%02d:%02d\n", timeinfo->tm_hour, timeinfo->tm_min, timeinfo->tm_sec);
	printf("Current date: %2d.%2d.%2d\n", timeinfo->tm_mday, timeinfo->tm_mon+1, timeinfo->tm_year-100);
	printf("Current local time and date: %s\n", asctime(timeinfo));
	printf("timestamp: %d\n",(int)time(NULL));
	return 0;

}

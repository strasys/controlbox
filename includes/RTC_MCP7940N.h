/*
 * RTC_MCP7940N.h
 *
 *  Created on: 02.10.2014
 *      Author: Johannes Strasser
 */

#ifndef RTC_MCP7940N_H_
#define RTC_MCP7940N_H_

typedef struct {
	int on; // ?
	int seconds;
	int minutes;
	int hours;
	int mode12;
	int mode24;
	int dayOfWeek;
	int day;
	int month;
	int year;
} RTC;

void init_RTC(unsigned char I2CAddress);
void RTC_start_oscillator(int handler);
int RTC_get_seconds(unsigned char I2CAddress);
int RTC_set_seconds(int seconds, unsigned char I2CAddress);
int RTC_get_minutes(unsigned char I2CAddress);
int RTC_set_minutes(int minutes, unsigned char I2CAddress);
int RTC_get_hours(unsigned char I2CAddress);
int RTC_set_hours(int hours, unsigned char I2CAddress);
void RTC_set_hourmode(int handler, int mode);
int RTC_get_dayOfWeek(unsigned char I2CAddress);
int RTC_set_dayOfWeek(int _day, unsigned char I2CAddress);
int RTC_get_day(unsigned char I2CAddress);
int RTC_set_day(int date, unsigned char I2CAddress);
int RTC_get_year(unsigned char I2CAddress);
int RTC_set_year(int year, unsigned char I2CAddress);
int RTC_get_month(unsigned char I2CAddress);
int RTC_set_month(int month, unsigned char I2CAddress);
int RTC_get_time(unsigned char *_time, unsigned char I2CAddress);
void RTC_set_time(int *buf_time, unsigned char I2CAddress);
int RTC_get_datum(unsigned char *_date, unsigned char I2CAddress);
/*
 * RTC_set_datum: buf_date = {day, date, month, year}
 * day = Weekday starting from monday 1-7
 * year only two digits
 */
void RTC_set_datum(unsigned char *buf_date, unsigned char I2CAddress);
int RTC_get_formatted(char * p_formatted, unsigned char I2CAddress);
RTC RTC_get_all(unsigned char I2CAddress);
void RTC_print_status(void);

#endif /* RTC_MCP7940N_H_ */

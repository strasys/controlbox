/*
 * RTC_MCP7940N.c
 *
 *  Created on: 02.10.2014
 *      Author: Johannes Strasser
 *
 * Firmware module for the RTC MCP7940N
 * Manufacturer: Microchip Technology Inc.
 *
 *
 *
 */

#include <stdio.h>
#include <stdlib.h>
#include <errno.h>
#include "I2C-handler.h"
#include "RTC_MCP7940N.h"

//TODO: Clarify definition of struct => error

RTC RTC_info;

void init_RTC(unsigned char I2CAddress) {

	int reg = 0x03;	//check in reg 0x03 Bit 5 = OSCON = 1 if the oscillator is running
	unsigned char buf[2] = { 0 };
	int OSCON, VBATEN;
	int handler;

	handler = i2c_open(I2CAddress, addr_RTC_MCP7940N);
	i2c_write_byte(handler, reg);
	i2c_read_byte(handler, buf);

	OSCON = buf[0] & 0b00100000;		//clear all bits except bit 5
	VBATEN = buf[0] & 0b00001000;		//clear all bits except bit 3

	RTC_set_hourmode(handler, 0);

	if ((OSCON >> 5) != 1) {
		RTC_start_oscillator(handler);
	}

	if ((VBATEN >> 3) != 1) {//check if VBATEN = 1 => if not set one enables back up with battery coin
		buf[1] = buf[0] | 0b00001000;
		buf[0] = reg;
		i2c_write(handler, buf, 2);
	}
	RTC_info.on = 1;
	i2c_close(handler);
}

void RTC_start_oscillator(int handler) {
	unsigned char buf[2] = { 0 };
	buf[0] = 0x00; 		//Bit 7 of reg 0x00 has to set to one to start the clock
	buf[1] = 0b10000000;		//"or" function to set bit 7 to 1

	i2c_write(handler, buf, 2);
	RTC_info.on = 1;
}

int RTC_get_seconds(unsigned char I2CAddress) {
	int handler, reg = 0x00;// in reg 0x00 Bit 0:3 0-9 sec. and 4:6 10 Seconds 0-5
	unsigned char buf[1] = { 0 };
	unsigned int seconds, secondsten;

	handler = i2c_open(I2CAddress, addr_RTC_MCP7940N);
	i2c_write_byte(handler, reg);
	i2c_read_byte(handler, buf);
	i2c_close(handler);
	seconds = buf[0] & 0b00001111;
	secondsten = (buf[0] & 0b01110000) >> 4;

	RTC_info.seconds = secondsten * 10 + seconds;

	return (RTC_info.seconds);
}

int RTC_set_seconds(int seconds, unsigned char I2CAddress) {
	int handler, reg = 0x00;
	unsigned char buf[2] = { reg, 0 }; //will start as well the clock if not already running

	if (seconds > 59) {
		printf("ERROR seconds: %i/n", seconds);
		return (-1);
	}

	div_t secondsten;
	secondsten = div(seconds, 10);
	buf[1] = ((secondsten.quot & 0b00000111) << 4)
			| ((seconds - secondsten.quot * 10) & 0b10001111) | 0b10000000;

	handler = i2c_open(I2CAddress, addr_RTC_MCP7940N);
	i2c_write(handler, buf, 2);
	i2c_close(handler);

	return (1);
}

int RTC_get_minutes(unsigned char I2CAddress) {
	int handler, reg = 0x01; // in reg 0x01 Bit 0:3 0-9 min. and 4:6 10 minutes 0-5
	unsigned char buf[1] = { 0 };
	unsigned int minutesten, minutessingle;

	handler = i2c_open(I2CAddress, addr_RTC_MCP7940N);
	i2c_write_byte(handler, reg);
	i2c_read_byte(handler, buf);
	i2c_close(handler);

	minutesten = (buf[0] & 0b01110000) >> 4;
	minutessingle = buf[0] & 0b00001111;

	RTC_info.minutes = 10 * minutesten + minutessingle;

	return (RTC_info.minutes);
}

int RTC_set_minutes(int minutes, unsigned char I2CAddress) {
	int handler, reg = 0x01;
	unsigned char buf[2] = { reg, 0 };

	if (minutes > 59) {
		printf("ERROR minutes: %i/n", minutes);
		return (-1);
	}

	div_t minutesten;
	minutesten = div(minutes, 10);
	buf[1] = ((minutesten.quot & 0b00000111) << 4)
			| ((minutes - minutesten.quot * 10) & 0b00001111);

	handler = i2c_open(I2CAddress, addr_RTC_MCP7940N);
	i2c_write(handler, buf, 2);
	i2c_close(handler);

	return (minutes);
}
/*
 * The RTC_get_hours function is only for the 24 hour mode!
 *
 */
int RTC_get_hours(unsigned char I2CAddress) {
	int handler, reg = 0x02; // in reg 0x02 Bit 0:3 0-9 h and 4:5 10 ten hours bit 6 = 1 = 12 hour mode
	unsigned char buf[1] = { 0 };
	unsigned int hours, hoursten;

	handler = i2c_open(I2CAddress, addr_RTC_MCP7940N);
	i2c_write_byte(handler, reg);
	i2c_read_byte(handler, buf);
	i2c_close(handler);

	hours = buf[0] & 0b00001111;
	hoursten = (buf[0] & 0b00110000) >> 4;
	RTC_info.hours = hoursten * 10 + hours;

	return (RTC_info.hours);
}
/*
 * The RTC_set_hours function is only for the 24 hour mode!
 */
int RTC_set_hours(int hours,unsigned char I2CAddress) {
	int handler, reg = 0x02;
	unsigned char buf[2] = { reg, 0 };

	if (hours > 24) {
		printf("ERROR hours: %i/n", hours);
		return (-1);
	}

	div_t hoursten;
	hoursten = div(hours, 10);
	buf[1] = ((hoursten.quot & 0b00000011) << 4)
			| ((hours - hoursten.quot * 10) & 0b00001111); //To simplify set will only done in 24h mode Bit 6 = 0

	handler = i2c_open(I2CAddress, addr_RTC_MCP7940N);
	i2c_write(handler, buf, 2);
	i2c_close(handler);

	return (hours);
}

void RTC_set_hourmode(int handler, int mode) { //mode 0: 24h and mode 1: 12h mode
	unsigned char buf1[2] = { 0 }, buf[1] = { 0 }; // in reg 0x02 Bit 0:3 0-9 hour, Bit 4:5 1-2 ten in the 24 hours mode
	buf1[0] = 0x02;						// Bit 6 0: 12 h mode and 1 24 h mode

	i2c_write_byte(handler, buf1[0]);
	i2c_read_byte(handler, buf);

	if (mode == 1) {
		buf1[1] = buf[0] | 0b01000000;						//set bit 6 to 1
	}
	if (mode == 0) {
		buf1[1] = buf[0] & 0b00111111;						//set Bit 6 to 0
	}

	i2c_write(handler, buf1, 2);
}

int RTC_get_dayOfWeek(unsigned char I2CAddress) {

	int handler, reg = 0x03;//in reg 0x03 Bit 0:2 day, Bit 3 pufferd by battery if Vss fails, Bit 4 is set to 1 if no VSS, Bit 5 is 1 when the Oscillator is running
	unsigned char buf[1] = { 0 };
	unsigned int day;

	handler = i2c_open(I2CAddress, addr_RTC_MCP7940N);
	i2c_write_byte(handler, reg);
	i2c_read_byte(handler, buf);
	i2c_close(handler);

	day = buf[0] & 0b00000111;
	RTC_info.dayOfWeek = day;

	return (RTC_info.dayOfWeek);
}

int RTC_set_dayOfWeek(int _day, unsigned char I2CAddress) {
	int handler, reg = 0x03;
	if (_day > 7) {
		printf("ERROR day: %i/n", _day);
		return (-1);
	}

	unsigned char buf[2] = { reg, 0 };
	buf[1] = _day | 0b00001000;

	handler = i2c_open(I2CAddress, addr_RTC_MCP7940N);
	i2c_write(handler, buf, 2);
	i2c_close(handler);

	return (_day);
}

int RTC_get_day(unsigned char I2CAddress) {

	int handler, reg = 0x04;//in reg 0x04 Bit 0:3 date 0 - 9, Bit 4:5 ten's of month
	unsigned char buf[1] = { 0 };
	unsigned int datesingle, dateten;

	handler = i2c_open(I2CAddress, addr_RTC_MCP7940N);
	i2c_write_byte(handler, reg);
	i2c_read_byte(handler, buf);
	i2c_close(handler);

	datesingle = buf[0] & 0b00001111;
	dateten = (buf[0] & 0b00110000) >> 4;

	RTC_info.day = 10 * dateten + datesingle;

	return (RTC_info.day);
}

int RTC_set_day(int day,unsigned char I2CAddress) {
	int handler, reg = 0x04;
	unsigned char buf[2] = { reg, 0 };
	if (day > 31 || day < 1) {
		printf("ERROR date: %i\n", day);
		return (-1);
	}

	div_t dateten;
	dateten = div(day, 10);
	buf[1] = ((dateten.quot & 0b00000011) << 4)
			| ((day - dateten.quot * 10) & 0b00001111);

	handler = i2c_open(I2CAddress, addr_RTC_MCP7940N);
	i2c_write(handler, buf, 2);
	i2c_close(handler);

	return (day);
}

int RTC_get_year(unsigned char I2CAddress) {
	int handler, reg = 0x06;//int reg 0x06 Bit 0:3 year 0 - 9, Bit 4:7 tens of years
	unsigned char buf[1] = { 0 };
	unsigned int yearsingle, yearten;

	handler = i2c_open(I2CAddress, addr_RTC_MCP7940N);
	i2c_write_byte(handler, reg);
	i2c_read_byte(handler, buf);
	i2c_close(handler);

	yearsingle = buf[0] & 0b00001111;
	yearten = (buf[0] & 0b11110000) >> 4;

	RTC_info.year = 10 * yearten + yearsingle + 2000;

	return (RTC_info.year);
}

int RTC_set_year(int year, unsigned char I2CAddress) {
	int handler, reg = 0x06;
	unsigned char buf[2] = { reg, 0 };
	if (year > 99) {
		printf("ERROR year: %i\n", year);
		return (-1);
	}

	div_t yearten;
	yearten = div(year, 10);
	buf[1] = ((yearten.quot & 0b00001111) << 4)
			| ((year - yearten.quot * 10) & 0b00001111);

	handler = i2c_open(I2CAddress, addr_RTC_MCP7940N);
	i2c_write(handler, buf, 2);
	i2c_close(handler);

	return (year);
}

int RTC_get_month(unsigned char I2CAddress) {
	int handler, reg = 0x05;//in reg 0x05 Bit 0:3 month 0 - 9, Bit 4 ten's of month, Bit 5 shows leap year
	unsigned char buf[1] = { 0 }, monthsingle, monthten;

	handler = i2c_open(I2CAddress, addr_RTC_MCP7940N);
	i2c_write_byte(handler, reg);
	i2c_read_byte(handler, buf);
	i2c_close(handler);

	monthsingle = buf[0] & 0b00001111;
	monthten = (buf[0] & 0b00010000) >> 4;

	RTC_info.month = 10 * monthten + monthsingle;

	return (RTC_info.month);
}

int RTC_set_month(int month, unsigned char I2CAddress) {
	int handler, reg = 0x05;
	unsigned char buf[2] = { reg, 0 };
	if (month > 12 || month < 1) {
		printf("ERROR month: %i\n", month);
		return (-1);
	}

	div_t monthten;
	monthten = div(month, 10);
	buf[1] = ((monthten.quot & 0b00000001) << 4)
			| ((month - monthten.quot * 10) & 0b00001111);
	handler = i2c_open(I2CAddress, addr_RTC_MCP7940N);
	i2c_write(handler, buf, 2);
	i2c_close(handler);

	return (month);
}

int RTC_get_time(unsigned char *buf_time, unsigned char I2CAddress) {

	RTC_get_hours(I2CAddress);
	RTC_get_minutes(I2CAddress);
	RTC_get_seconds(I2CAddress);

	//printf("%02i:%02i:%02i\n", RTC_info.RTC_hours, RTC_info.RTC_minutes, RTC_info.RTC_seconds);

	buf_time[0] = RTC_info.hours;
	buf_time[1] = RTC_info.minutes;
	buf_time[2] = RTC_info.seconds;

	return (1);
}

/*
 * the sequence in the buf_time variable has to be
 * as follows: hh, min, sec.
 */
void RTC_set_time(int *buf_time, unsigned char I2CAddress) {
	int hours, minutes, seconds;
	hours = buf_time[0];
	minutes = buf_time[1];
	seconds = buf_time[2];
	RTC_set_hours(hours, I2CAddress);
	RTC_set_minutes(minutes, I2CAddress);
	RTC_set_seconds(seconds, I2CAddress);

//	printf("%i:%i:%i\n", hours, minutes, seconds);
}

int RTC_get_datum(unsigned char *_date, unsigned char I2CAddress) {
	RTC_get_dayOfWeek(I2CAddress);
	RTC_get_day(I2CAddress);
	RTC_get_month(I2CAddress);
	RTC_get_year(I2CAddress);

//	printf("%i %02i.%02i.%i\n", RTC_info.RTC_day, RTC_info.RTC_date, RTC_info.RTC_month, RTC_info.RTC_year);

	_date[0] = RTC_info.day;
	_date[1] = RTC_info.dayOfWeek;
	_date[2] = RTC_info.month;
	_date[3] = RTC_info.year;

	return (1);
}

RTC RTC_get_all(unsigned char I2CAddress) {
	RTC_get_dayOfWeek(I2CAddress);
	RTC_get_day(I2CAddress);
	RTC_get_month(I2CAddress);
	RTC_get_year(I2CAddress);
	RTC_get_hours(I2CAddress);
	RTC_get_minutes(I2CAddress);
	RTC_get_seconds(I2CAddress);
	return RTC_info;
}

int RTC_get_formatted(char * p_formatted, unsigned char I2CAddress) {
	RTC rtc;
	rtc = RTC_get_all(I2CAddress);
	sprintf(p_formatted, "%02d.%02d.%02d %02d:%02d:%02d", rtc.year, rtc.month,
			rtc.day, rtc.hours, rtc.minutes, rtc.seconds);
	return 0;
}
/*
 * the sequence in the buf_date variable has to be
 * as follows: day, date, month, year
 * For the year only two digits! 2014 = 14!
 */
void RTC_set_datum(unsigned char *buf_date, unsigned char I2CAddress) {

	RTC_set_dayOfWeek(buf_date[0], I2CAddress);
	RTC_set_day(buf_date[1], I2CAddress);
	RTC_set_month(buf_date[2], I2CAddress);
	RTC_set_year(buf_date[3], I2CAddress);
}

void RTC_print_status(void) {
	printf("clock on: %i<br>\n", RTC_info.on);
	printf("hours:    %i<br>\n", RTC_info.hours);
	printf("minutes:  %i<br>\n", RTC_info.minutes);
	printf("seconds:  %i<br>\n", RTC_info.seconds);
	printf("day of week: %i<br>\n", RTC_info.dayOfWeek);
	printf("day:     %i<br>\n", RTC_info.day);
	printf("month:    %i<br>\n", RTC_info.month);
	printf("year:     %i<br>\n", RTC_info.year);
}

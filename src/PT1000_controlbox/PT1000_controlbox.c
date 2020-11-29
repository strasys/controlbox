/*
 * PT1000_sensingbox.c
 *
 *  Created on: 31.03.2018
 *      Author: Johannes Strasser
 *      www.strasys.at
 */

#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <unistd.h>
#include <errno.h>
#include <math.h>
#include "ADS1115.h"
#include "24AA256-EEPROM.h"
#include "I2C-handler.h"

//calculation of temperature based on hardware design
void calctemp_Celsius(int channel, double *t_celsius, int exNo){
	double A, B;
	int AINval;
	//get AINval from ADC
	AINval = getADC16PT1000singleval(channel, exNo);
//Hardware PT1000 Funktion EL-100-020-020
	A = pow(10, -9);
	B = AINval * AINval;
	//printf("AINval = %i\n", AINval);
	//Hardware related function.
	//Derived from hardware design simulation.
	//Trend function generated with spread sheet trend line
	//t_celsius[0] = 0.0042*AINval+12.764;
	//t_celsius[0] = 0.0043*AINval-25.23;
	t_celsius[0] = -9.3196*A*B +0.0044249*AINval-26.9209;
 }

void calctemp_Kelvin(int channel, double *t_kelvin, int exNo){
	double t_celsius, A, B;
	int AINval;
	//get AINval from ADC
	AINval = getADC16PT1000singleval(channel, exNo);
	//Hardware PT1000 Funktion
	A = pow(10, -6);
	B = AINval * AINval;
	//Hardware related function.
	//Derived from hardware design simulation.
	//Trend function generated with spread sheet trend line
	t_celsius = -2.08 * A * B + 0.0484*AINval - 34.2;
	t_kelvin[0] = t_celsius + 273.15;
}

void round05(double *valtoberound, double *roundresult){
	double valfraction, valfractionround, valint;
	int signflag;
	valfraction = modf(valtoberound[0], &valint);

	//check sign
	if (valfraction < 0 ) signflag = -1;
	if (valfraction > 0) signflag = 1;

	if (fabs(valfraction) < 0.3)
	{
		valfractionround = 0.0;
	}
	else if ((fabs(valfraction) <= 0.7) && (fabs(valfraction) >= 0.3))
	{
		valfractionround = 0.5;
	}
	else if (fabs(valfraction) > 0.7)
	{
		valfractionround = 1.0;
	}
	if (signflag == -1) roundresult[0] = valint - valfractionround;
	if (signflag == 1) roundresult[0] = valint + valfractionround;
}

void getbusaddr(int extno, int *busAddr){

			char eepromdata[255];
			int busaddrext;
			unsigned int regreadstart = 256;
			unsigned int regreadnumberbyte = 64;
			char extaddrEEPROM_temp[64];
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
			busAddr[0] = busaddrext;
}

int main(int argc, char *argv[], char *env[]){

char input[3], eepromdata[255];
double t_celsius[1], averagetemp, temp;
int i, channel, x, busaddrext, extno;

//read in arguments
for (i=1;i<argc;i++){
	sscanf(argv[i],"%c",&input[i]);
}
//initADS1015(0x48);

switch (input[1]){
case 'h':
	printf("Description of function PT1000 handler:\n"
			"PT1000handler [g] [Channel Number (0 = PT1000 channel 1, 1 = 2, etc.] [Hardware extension]\n"
			"	g => get\n"
			"	h => help\n"
			"   t => get raw value\n"
			"	Channel => integer Number from 0 ... 3\n"
			"	hw extension => integer 1 - 4\n");
	break;
case 'g':
	if (argc != 4) {
		fprintf(stderr, "PT1000handler: missing argument! => %s\n", strerror(errno));
	} else {
		channel = atoi(argv[2]);
		extno = atoi(argv[3]);
		unsigned int regreadstart = 256;
		unsigned int regreadnumberbyte = 64;
		char extaddrEEPROM_temp[64];
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

		//Bei Kanal - Wechsel muss der Alte Wert erst überschrieben werden.
		calctemp_Celsius(channel, t_celsius, busaddrext);
		t_celsius[0] = 0;
		usleep(100000);

		for (x=0;x<20;x++){
			calctemp_Celsius(channel, t_celsius, busaddrext);
			temp = temp + t_celsius[0];
			//usleep(1000);
		}
		averagetemp = temp/20;

	//	round05(&t_celsius[0], t_celsiusround);
	//	round05(&averagetemp, t_celsiusround);
	//  printf("%.01f\n", t_celsiusround[0]);
		printf("%.2f\n", averagetemp);

	}
	break;
case 'i':
	initADS1115(72);
	break;
case 't':
	channel = atoi(argv[2]);
	extno = atoi(argv[3]);
	int busAddr[1];
	float AINval, AINvaltemp[5];
	getbusaddr(extno, busAddr);
	for(i=0;i<5;i++){
		for (x=0;x<20;x++){
			AINval = getADC16PT1000singleval(channel, busAddr[0]);
			AINvaltemp[i] = AINvaltemp[i] + AINval;
			usleep(1000);
		}
		usleep(20000);
	}
	float AINsample = 0;

	for (i=0;i<5;i++){
		AINsample = AINsample + AINvaltemp[i]/20;
	}

	printf("%.0f\n", AINsample/5);

	break;
default:
	printf("Wrong arguments!\n"
			"Try PT1000handler h\n");
	break;
}

	return 0;
}

/*
 * RTChandler.c
 *
 *  Created on: 12.07.2016
 *      Author: Johannes Strasser
 *
 *This program is supposed to be called from the server
 *to set and read the on board RTC.
*/

#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <unistd.h>
#include "GPIO.h"

int main(int argc, char *argv[], char *env[]){
	int i = 0;
	int Num = 0, Value = 0;
	int GPIOstatval[16];
	char setget;
	char InOut;


	if (argv[1] != 0){
	sscanf(argv[1], "%c", &setget);
	}


	if ((setget == 's')){
		Num = atoi(argv[2]);
		Value = atoi(argv[3]);
		int offset = 12;
		Num = Num + offset;
		//Num = GPIOnum;
		//Value = GPIOvalue;
		printf("Num=%d Value=%d\n",Num, Value);
		printf("Value=%d\n", Value);
		gpio_set_value(IN_OUT_2[Num][0], Value);
		//for (i = 0; i < 8; i++){
		//		GPIOstatval[i] = gpio_get_value(IN_OUT[i][0]);
		//		printf("%d\n", GPIOstatval[i]);
		//		}
	}

	if ((setget == 'g')){
		sscanf(argv[2], "%c", &InOut);

		if ((InOut == 'I')){
					for (i = 0; i < 12; i++){
					GPIOstatval[i] = gpio_get_value(IN_OUT_2[i][0]);
					printf("%d\n", GPIOstatval[i]);
					}
				}

		else if ((InOut == 'O')){
			for (i = 12; i < 28; i++){
			GPIOstatval[i-12] = gpio_get_value(IN_OUT_2[i][0]);
			printf("%d\n", GPIOstatval[i-12]);
			}
		}

	}

	if ((setget == 'h')){
		printf(" Pin - Numbering as used at GPIOhandler_020: \n"
				"Input = 0 - 11\n"
				"P8_18 65 INPUT IN1 \n"
				"P8_17 27 INPUT IN2 \n"
				"P8_16 46 INPUT IN3 \n"
				"P8_15 47 INPUT IN4 \n"
				"P8_14 26 INPUT IN5 \n"
				"P8_13 23 INPUT IN6 \n"
				"P8_12 44 INPUT IN7 \n"
				"P8_11 45 INPUT IN8 \n"
				"P8_10 68 INPUT IN9 \n"
				"P8_09 69 INPUT IN10 \n"
				"P8_08 67 INPUT IN11 \n"
				"P8_07 66 INPUT IN12 \n"
				"Output = 0 - 11 => usable pins\n"
				"P8_27 86 OUTPUT OUT1 \n"
				"P8_28 88 OUTPUT OUT2 \n"
				"P8_29 87 OUTPUT OUT3 \n"
				"P8_30 89 OUTPUT OUT4 \n"
				"P8_39 76 OUTPUT OUT5 \n"
				"P8_40 77 OUTPUT OUT6 \n"
				"P8_41 74 OUTPUT OUT7 \n"
				"P8_42 75 OUTPUT OUT8 \n"
				"P8_43 72 OUTPUT OUT9 \n"
				"P8_44 73 OUTPUT OUT10 \n"
				"P8_45 70 OUTPUT OUT11 \n"
				"P8_46 71 OUTPUT OUT12 \n"
				"Indicator lights at the front:\n"
				"Output = 12 - 15\n"
				"P9_14 50 OUTPUT RUN \n"
				"P9_15 48 OUTPUT ERROR \n"
				"P9_23 49 OUTPUT DIGIOUT_UART2 \n"
				"P9_27 115 OUTPUT DIGIOUT_UART1 \n"
				"GPIO_handler [s, g] [I, O] [No. Output][ON = 1, OFF = 0] \n"
				"example:\n"
				"GPIO_handler_020 s 12 1\n"
				"GPIO_handler_020 g I\n"
				"GPIO_handler_020 g O\n");
	}

	return 0;
}

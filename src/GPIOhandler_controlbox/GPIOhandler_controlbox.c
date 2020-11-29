/*
 * GPIOhandler_controlbox.c
 *
 *  Created on: 14.07.2020
 *      Author: Johannes Strasser
 *
 *This program is supposed to be called from the server
 *to set and read the on board GPIO's for controlboxes.
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
		int offset = 4;
		Num = Num + offset;
		//Num = GPIOnum;
		//Value = GPIOvalue;
		printf("Num=%d Value=%d\n",Num, Value);
		printf("Value=%d\n", Value);
		gpio_set_value(IN_OUT_3[Num][0], Value);
	}

	if ((setget == 'g')){
		sscanf(argv[2], "%c", &InOut);

		if ((InOut == 'I')){
					for (i = 0; i < 4; i++){
					GPIOstatval[i] = gpio_get_value(IN_OUT_3[i][0]);
					printf("%d\n", GPIOstatval[i]);
					}
				}

		else if ((InOut == 'O')){
			for (i = 4; i < 13; i++){
			GPIOstatval[i-4] = gpio_get_value(IN_OUT_3[i][0]);
			printf("%d\n", GPIOstatval[i-4]);
			}
		}

	}

	if ((setget == 'h')){
		printf(" Pin - Numbering as used at GPIOhandler_controlbox: \n"
				"Input = 0 - 3\n"
				"P8_07 66 INPUT IN0 \n"
				"P8_08 67 INPUT IN1 \n"
				"P8_09 69 INPUT IN2 \n"
				"P8_10 68 INPUT IN3 \n"
				"Output = 0 - 8 => usable pins\n"
				"P8_11 45 OUTPUT OUT0 \n"
				"P8_12 44 OUTPUT OUT1 \n"
				"P8_13 23 OUTPUT OUT2 \n"
				"P8_14 26 OUTPUT OUT3 \n"
				"P8_15 47 OUTPUT OUT4 \n"
				"P9_13 31 OUTPUT OUT5 Composer BLUE \n"
				"P9_16 51 OUTPUT OUT6 Composer RED \n"
				"P9_14 50 OUTPUT OUT7 Datatransf BLUE \n"
				"P9_15 48 OUTPUT OUT8 Datatransf RED \n"
				"GPIO_handler [s, g] [I, O] [No. Output][ON = 1, OFF = 0] \n"
				"example:\n"
				"GPIO_handler_020 s 12 1\n"
				"GPIO_handler_020 g I\n"
				"GPIO_handler_020 g O\n");
	}

	return 0;
}

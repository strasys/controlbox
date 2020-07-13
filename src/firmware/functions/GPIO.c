/*
 * GPIO.c
 *
 *  Created on: 24.10.2014
 *      Author: Johannes Strasser
 *      www.strasys.at
 */

#include <stdio.h>
#include <stdlib.h>
#include <errno.h>
#include <string.h>
#include "GPIO.h"

/*
 * Variable naming is based on the add on board design
 * comments are based on the beaglebone naming.
 * Definition for: EL-100-010-001 (home control board)
 * applicable device tree: strasys-homenew.dts
 */
//definition: 1 = "out"; 0 = "in"
unsigned int IN_OUT_1[][2] = { { 66, 1 }, //P8_07 "out" OUT 1  value 1 = ON; 0 = OFF (= Naming on EL-100-010-001)
		{ 67, 1 }, //P8_08 "out" OUT 2
		{ 69, 1 }, //P8_09 "out" OUT 3
		{ 68, 1 }, //P8_10 "out" OUT 4
		{ 45, 1 }, //P8_11 "out" OUT 5
		{ 44, 1 }, //P8_12 "out" OUT 6
		{ 23, 1 }, //P8_13 "out" OUT 7
		{ 26, 1 }, //P8_14 "out" OUT 8
		{ 47, 0 }, //P8_15 "in"  IN 1  value 1 = low; 0 = high (= pull up circuit)
		{ 46, 0 }, //P8_16 "in"  IN 2
		{ 27, 0 }, //P8_17 "in"  IN 3
		{ 65, 0 }, //P8_18 "in"  IN 4
		{ 0, 0 } };

unsigned int RESET_4D[2] = { 61, 0 }; //P8_26 "in" Pin on Sub - connector for Reset, etc. purposes

unsigned int TX_434MHz[2] = { 60, 1 }; //P9_12 "out" Signal generator for 434 MHz Funkmodul

unsigned int initStatusOut = 0b00000000; // Defines the initial value set of the Output Pins

/*
 * Variable naming is based on the add on board design
 * comments are based on the beaglebone naming.
 * Definition for: EL-100-020-001 (DIN-Rail-controller)
 * applicable device tree: strasys-EL100020001.dts
 */
//definition: 1 = "out"; 0 = "in"
//def.matrix: 0 = PortNumber; 1 = Input =0/Output=1; 2 = Initial value of Output pin
unsigned int IN_OUT_2[][3] = {
		{ 65, 0,  },	// P8_18 65 INPUT "IN1"
		{ 27, 0,  },	// P8_17 27 INPUT "IN2"
		{ 46, 0,  },	// P8_16 46 INPUT "IN3"
		{ 47, 0,  },	// P8_15 47 INPUT "IN4"
		{ 26, 0,  },	// P8_14 26 INPUT "IN5"
		{ 23, 0,  },	// P8_13 23 INPUT "IN6"
		{ 44, 0,  },	// P8_12 44 INPUT "IN7"
		{ 45, 0,  },	// P8_11 45 INPUT "IN8"
		{ 68, 0,  },	// P8_10 68 INPUT "IN9"
		{ 69, 0,  },	// P8_09 69 INPUT "IN10"
		{ 67, 0,  },	// P8_08 67 INPUT "IN11"
		{ 66, 0,  },	// P8_07 66 INPUT "IN12"
		{ 86, 1, 0},	// P8_27 86 OUTPUT "OUT1"
		{ 88, 1, 0},	// P8_28 88 OUTPUT "OUT2"
		{ 87, 1, 0},	// P8_29 87 OUTPUT "OUT3"
		{ 89, 1, 0},	// P8_30 89 OUTPUT "OUT4"
		{ 76, 1, 0},	// P8_39 76 OUTPUT "OUT5"
		{ 77, 1, 0},	// P8_40 77 OUTPUT "OUT6"
		{ 74, 1, 0},	// P8_41 74 OUTPUT "OUT7"
		{ 75, 1, 0},	// P8_42 75 OUTPUT "OUT8"
		{ 72, 1, 0},	// P8_43 72 OUTPUT "OUT9"
		{ 73, 1, 0},	// P8_44 73 OUTPUT "OUT10"
		{ 70, 1, 0},	// P8_45 70 OUTPUT "OUT11"
		{ 71, 1, 0},	// P8_46 71 OUTPUT "OUT12"
		{ 50, 1, 0},	// P9_14 50 OUTPUT "RUN"
		{ 48, 1, 0},	// P9_15 48 OUTPUT "ERROR"
		{ 49, 1, 0},	// P9_23 49 OUTPUT "DIGIOUT_UART2"
		{ 115, 1, 0},	// P9_27 115 OUTPUT "DIGIOUT_UART1"
		{ 0, 0, 0} };

//GPIO gpio;
/*
 * devicetype:
 * EL-100-020-001 = 2
 * EL-100-010-001 = 1
 */
void init_GPIO(int devicetype) {
	int i;
	switch(devicetype) {
	case 1:
			//The following for loop sets all OUT_x defined pins
				//as defined

				for (i = 0; !IN_OUT_1[i][0] == 0; ++i) {
					gpio_export(IN_OUT_1[i][0]);
					gpio_set_direction(IN_OUT_1[i][0], IN_OUT_1[i][1]);
				}

				gpio_set_value_byte(initStatusOut);

				//set output pins values if values set in one byte
				// gpio_set_out_pin_value_byte(initStatusOut);

				gpio_export(RESET_4D[0]);
				gpio_set_direction(RESET_4D[0], RESET_4D[1]);

				gpio_export(TX_434MHz[0]);
				gpio_set_direction(TX_434MHz[0], TX_434MHz[1]);
				gpio_set_value(TX_434MHz[0], 0);
		break;
	case 2:
			for (i = 0; !IN_OUT_2[i][0] == 0; ++i) {
				gpio_export(IN_OUT_2[i][0]);
				gpio_set_direction(IN_OUT_2[i][0], IN_OUT_2[i][1]);
				//set value if the pin is an output pin.
				if (IN_OUT_2[i][1] == 1){
					gpio_set_value(IN_OUT_2[i][0], IN_OUT_2[i][2]);
				}
			}
			break;
	default: printf("Error init GPIO\n"); break;
	}


}

// Export a PIN
// gpio - Number = gpio2[2] = 2*32+2 = 66
int gpio_export(int gpio) {
	FILE *f = NULL;
	f = fopen(GPIO_DIR "/export", "w");
	if (f != NULL) {
		fprintf(f, "%d", gpio);
		fclose(f);
		return 0;
	}
	perror(GPIO_DIR"/gpio/export");
	return 0;
}
// Set if pin is an Input = "in" or an Output = "out"
int gpio_set_direction(int gpio, int direction) {
	FILE *f = NULL;
	char file_dir[255];
	char *direction_str = NULL;

	if (direction == 1) {
		direction_str = "out";
	}
	if (direction == 0) {
		direction_str = "in";
	}

	printf("\"%s\"\n", direction_str);

	snprintf(file_dir, sizeof(file_dir), GPIO_DIR "/gpio%d/direction", gpio);
	f = fopen(file_dir, "w");
	if (f != NULL) {

		fprintf(f, "%s", direction_str);

		fclose(f);
		return 0;
	}
	perror(GPIO_DIR"/gpio/direction");
	return 0;
}

// Set value of the pin
// 1 = Signal "high", 0 = Signal "low"
int gpio_set_value(int gpio, int value) {
	FILE *f = NULL;
	char file_value[255];
	snprintf(file_value, sizeof(file_value), GPIO_DIR "/gpio%d/value", gpio);
	f = fopen(file_value, "w");
	if (f != NULL) {
		fprintf(f, "%d", value);
		fclose(f);
		return 0;

	}
	perror(file_value);
	return 0;
}

int gpio_get_value(int gpio) {
	FILE *f = NULL;
	char file_value[255];
	char value_buffer[255];
	snprintf(file_value, sizeof(file_value), GPIO_DIR "/gpio%d/value", gpio);
	f = fopen(file_value, "r");
	if (f != NULL) {
		int len;
		len = fread(value_buffer, sizeof(char), 255, f);
		fclose(f);
		if (len > 0) {
			value_buffer[len] = 0;
			return atoi(value_buffer);
		}
	}
	perror(GPIO_DIR "/gpio/value");
	return 0;
}

/*
 *	statusOut is one byte which contains the status of 8 Output Pins
 *	The pins are named in the header OUT_x which is essential for
 *	the sequenz to work!
 */

void gpio_set_value_byte(int statusOut) {
	int i = 0;

	for (i = 0; i < 8; i++) {
		int tmp = (statusOut & 1);
		gpio_set_value(IN_OUT_1[i][0], tmp);
		statusOut >>= 1;
	}
}


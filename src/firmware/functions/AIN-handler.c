/*
 * AIN-handler.c
 *
 *  Created on: 28.12.2014
 *      Author: Johannes Strasser
 */

#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <unistd.h>
#include "AIN-handler.h"

int get_iio_value_n(int channel) {
	int len;
	char DIRvalue[255];
	char AINvalue[10];
	FILE *f = NULL;
	snprintf(DIRvalue, sizeof(DIRvalue), iio_DIR "/in_voltage%d_raw", channel);
	f = fopen(DIRvalue, "r");
	if (f != NULL) {

		len = fread(AINvalue, sizeof(char), 10, f);

		fclose(f);
		if (len > 0) {
			AINvalue[len] = 0;
			return (atoi(AINvalue));
		}
	}
	perror(iio_DIR "/in_voltage._raw");
	return -1;
}


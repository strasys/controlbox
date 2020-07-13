/*
 * PT100functions.c
 *
 *  Created on: 13.01.2015
 *      Author: Johannes Strasser
 */

#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <unistd.h>
#include <errno.h>
#include "AIN-handler.h"
#include "24AA256-EEPROM.h"

//The following function calculates the temperature
//based on an PT100 resistance input.
//The linear equation is based on a standard PT100
//between -20 to +40 °C.
double getPT100temp(double PT100resistance) {

	return ((PT100resistance - 100) / 0.3893090909); //Temperature in °C.
}

//Since most of the wires are Copper
//the function is limited to Copper.
double getWireResistanceCopper(double length, double area) {
	double specRes = 0.0175; // Specific resistance of Copper at 20°C in [Ohm * mm² / m]

	return ((2 * length * specRes) / area);			//Resistance in Ohm.
}

//This function calculates the wire offset
//and writes / generates and writes the value in the file
//PT100wireOffset.txt
//The wire offset is referenced to 0°C = 100 Ohm!
void setWireOffset(int channel, double length, double wireArea) {
	double wireOffset, wireRes;
	FILE *f = NULL;
	char DIR_PT100wireOffset[255] = { };
	char fopenModus[2] = { };

	wireRes = getWireResistanceCopper(length, wireArea);
	wireOffset = getPT100temp(wireRes + 100);

	//write wire offset to PT100wireOffset.txt

	if ((channel == 1) || (channel == 2)) {
		sprintf(DIR_PT100wireOffset, "/usr/lib/cgi-bin/PT100_%iwireOffset.txt", channel);

		if (access(DIR_PT100wireOffset, (R_OK | W_OK)) != -1) {
			sprintf(fopenModus, "r+");
		} else {
			sprintf(fopenModus, "w");
		}
	} else {
		fprintf(stderr, "setWireOffset: Invalid channel No. : %i\n", channel);
	}

	f = fopen(DIR_PT100wireOffset, fopenModus);
	fprintf(f,
			"PT100_%i:TempOffsetWire=%5.2f:WireLength=%6.2f:WireArea=%4.2f:R-wire=%5.2f",
			channel, wireOffset, length, wireArea, wireRes);
	fclose(f);
}

int getWireOffsetData(int channel, double data[]) {
	FILE *f = NULL;
	char DIR_PT100wireOffset[255] = { };
	float TempOffsetWire, WireLength, WireArea, R_wire;
	int i;

	if ((channel == 1) || (channel == 2)) {
		sprintf(DIR_PT100wireOffset, "/usr/lib/cgi-bin/PT100_%iwireOffset.txt", channel);

		if (access(DIR_PT100wireOffset, (R_OK | W_OK)) != -1) {
			f = fopen(DIR_PT100wireOffset, "r");
			fscanf(f,
					"PT100_%i:TempOffsetWire=%f:WireLength=%f:WireArea=%f:R-wire=%f",
					&i, &TempOffsetWire, &WireLength, &WireArea, &R_wire);
			fclose(f);
			data[0] = TempOffsetWire;
			data[1] = WireLength;
			data[2] = WireArea;
			data[3] = R_wire;
		} else {
			fprintf(stderr, "setWireOffsetData: File %s does not exist!\n",
					DIR_PT100wireOffset);
			return -1;
		}
	} else {
		fprintf(stderr, "setWireOffset: Invalid channel No. : %i\n", channel);
	}
	return 0;
}

/*
 * The following function is based on the simulated
 * electronic measurement circuit.
 * The curve is derived by simulating at different
 * PT100 resistances.
 */
double getCircuitTempSimu(int bitvalue) {

	return (0.0148651303 * bitvalue - 18.785514); //Temperature in °C;
}

// The following function writes the circuit
// related offset to the cap EEPROM.
void setCircuitOffset(double calResistor, int channel) {
	double circuitOffset;
	unsigned int EEPROMregister = 0;
	char datatoEEPROM[65] = { };
	int calBitvalue;

	if ((channel == 1) || (channel == 2)) {
		//Attention: Beaglebone AIN channels start counting at 0 !
		calBitvalue = get_iio_value_n(channel - 1);
		circuitOffset = getPT100temp(calResistor)
				- getCircuitTempSimu(calBitvalue);

		sprintf(datatoEEPROM,
				"R=%5.1f:PT100temp=%6.2f:CircuitTemp=%6.2f:CircuitOffset=%5.2f",
				calResistor, getPT100temp(calResistor),
				getCircuitTempSimu(calBitvalue), circuitOffset);
	}
	printf("datatoEEPROM: %s\n",datatoEEPROM);

	if (channel == 1) {
		EEPROMregister = 128;
	}
	else if (channel == 2) {
		EEPROMregister = 192;
	}

	EEPROMwriteblock64(EEPROMregister, datatoEEPROM);
}

void getCircuitOffsetData(int channel, double data[]) {
	unsigned int EEPROMaddressPT100_1 = 128;
	unsigned int EEPROMaddressPT100_2 = 192, address, length = 64;
	//int EEPROMoffsetR = 0, EEPROMoffsetPT100temp = 15, EEPROMoffsetCircuitTemp = 32, EEPROMoffsetCircuitOffset = 51;
	char EEPROMdata[255] = { };
	char *token = NULL;
	char Rcal[6], PT100temp[7], CircuitTemp[7], CircuitOffset[6];

	if (channel == 1 || channel == 2) {
		if (channel == 1) {
			address = EEPROMaddressPT100_1;
			EEPROMreadbytes(address, EEPROMdata, length);

		}
		if (channel == 2) {
			address = EEPROMaddressPT100_2;
			EEPROMreadbytes(address, EEPROMdata, 64);

		}
	} else {
		fprintf(stderr, "Channel Number error: %s\n", strerror( errno));
	}

	token = (char *) strtok(EEPROMdata, "=");
	token = (char *) strtok(NULL, ":");
	strcpy(Rcal, token);
	token = (char *) strtok(NULL, "=");
	token = (char *) strtok(NULL, ":");
	strcpy(PT100temp, token);
	token = (char *) strtok(NULL, "=");
	token = (char *) strtok(NULL, ":");
	strcpy(CircuitTemp, token);
	token = (char *) strtok(NULL, "=");
	token = (char *) strtok(NULL, ":");
	strcpy(CircuitOffset, token);

	data[0] = atof(Rcal);
	data[1] = atof(PT100temp);
	data[2] = atof(CircuitTemp);
	data[3] = atof(CircuitOffset);

}

double getTemp(int channel) {
	double circuitOffsetData[4];
	double wireOffsetData[4];
	double PT100temp;

	getCircuitOffsetData(channel, circuitOffsetData);
	getWireOffsetData(channel, wireOffsetData);
	//attention beaglebone channel 1 = 0!
	PT100temp = getCircuitTempSimu(get_iio_value_n(channel - 1))
			+ circuitOffsetData[3] - wireOffsetData[0];

	return (PT100temp);
}


/*
 * PT100functions.h
 *
 *  Created on: 13.01.2015
 *      Author: Johannes Strasser
 *
 *  PT100functions
 */

#ifndef SRC_FUNCTIONS_PT100FUNCTIONS_H_
#define SRC_FUNCTIONS_PT100FUNCTIONS_H_

//The following function calculates the temperature
//based on an PT100 resistance input.
//The linear equation is based on a standard PT100
//between -20 to +40 °C.
double getPT100temp(double PT100resistance);

//Since most of the wires are Copper
//the function is limited to Copper.
double getWireResistanceCopper(double length, double area);

//This function calculates the wire offset
//and writes / generates and writes the value in the file
//PT100wireOffset.txt
//The wire offset is referenced to 0°C = 100 Ohm!
void setWireOffset(int channel, double length, double wireArea);

int getWireOffsetData(int channel, double data[]);

/*
 * The following function is based on the simulated
 * electronic measurement circuit.
 * The curve is derived by simulating at different
 * PT100 resistances.
 */
double getCircuitTempSimu(int bitvalue);

// The following function writes the circuit
// related offset to the cap EEPROM.
void setCircuitOffset(double calResistor, int channel);

void getCircuitOffsetData(int channel, double data[]);

double getTemp(int channel);


#endif /* SRC_FUNCTIONS_PT100FUNCTIONS_H_ */

/*
 * ADS1015.h
 *
 *  Created on: 13.01.2016
 *      Author: Johannes Strasser
 *      www.strasys.at
 */

#ifndef ADS1015_H_
#define ADS1015_H_

void initADS1015(int I2Caddr);
/*
 *  getADCPT1000singleval: Is a function to read a single AIN channel.
 *  The ADS1015 has 4 channels (Channel 1 = 0; Channel 4 = 3)
 */
int getADCPT1000singleval(int channel, int I2Caddr);

#endif /* ADS1015_H_ */

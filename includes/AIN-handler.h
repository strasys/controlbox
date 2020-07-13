/*
 * AIN-handler.h
 *
 *  Created on: 28.12.2014
 *      Author: Johannes Strasser
 *
 *  This header file is used to generate
 *  a standardized access to the beaglebone
 *  on board analog in's.
 */

#ifndef AIN_HANDLER_H_
#define AIN_HANDLER_H_

#define iio_DIR "/sys/bus/iio/devices/iio:device0"

// This function should read the actual bit value
// of the given channel.
int get_iio_value_n(int channel);

#endif /* AIN_HANDLER_H_ */

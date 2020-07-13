/*
 * accessorg.h
 *
 *  Created on: 02.01.2016
 *      Author: Johannes Strasser
 *      File access functions.
 */

#ifndef ACCESSORG_H_
#define ACCESSORG_H_

//Get from user and group name the id number
void getuidbyname(char *name, long int *uidresult, long int *gidresult);
//Get informations about file
void getinfofile(int *filedescr, long int *uidowner, long int *gidowner, long int *fileprotection);

#endif /* ACCESSORG_H_ */

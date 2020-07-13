/*
 * common.c
 *
 *  Created on: 18.10.2014
 *      Author: Franz Mauch
 */

#include <fcntl.h>           /* For O_* constants */
#include <sys/stat.h>        /* For mode constants */
#include <semaphore.h>
#include <stdio.h>
#include <stdlib.h>
#include "common.h"

/*
 // TODO move to global handle file
 sem_t * bb_sem;

 int transfer_from_bb_to_file () {
 FILE * fd;
 ALL_in data;

 printf("___1\n");
 // lock bb while operating
 lock_bb();
 printf("___2\n");

 // for each data type
 data.rtc = RTC_get_all ();
 // gpio ...
 printf("___3\n");

 // unlock again - must be also called in case of errors
 unlock_bb();

 printf("___4\n");

 // TODO use function instead of system
 // remove old file
 system("rm /tmp/bb.line_in");
 printf("___5\n");
 // TODO Filename to .h
 fd = fopen ("/tmp/bb.line_in","w");
 fwrite (&data,sizeof(ALL_in),1,fd);
 fclose(fd);
 printf("___6\n");

 // TODO Fehlerhandling
 return 0;
 }

 int getDataFromFile (ALL_in *p_data) {
 FILE * fd;
 //char atime[20];
 fd = fopen ("/tmp/bb.line_in","r");
 fwrite (p_data,sizeof(ALL_in),1,fd);
 //RTC_get_formatted ((*p_data).rtc,atime);
 fprintf(fd,"%s\n","xyz");
 fclose(fd);
 // TODO Fehlerhandling
 return 0;
 }


 int lock_bb () {

 // get a semaphore - check for some example
 // TODO need add pthreads to libs
 bb_sem = sem_open ("bb_sem",0);
 if (bb_sem!=NULL) {
 sem_wait (bb_sem);
 }
 // TODO Fehlerhandling
 return 0;
 }

 int unlock_bb () {
 // return the  a semaphore
 if (bb_sem!=NULL) {
 sem_post (bb_sem);
 }
 // TODO Fehlerhandling
 return 0;
 }
 */

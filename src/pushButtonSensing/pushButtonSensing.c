/*
 * pushButtonSensing.c
 *
 *  Created on: 14.10.2015
 *  Author: Johannes Strasser
 *  www.strasys.at
 */

#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <unistd.h>
#include <errno.h>
#include <fcntl.h>
#include "GPIO.h"
#include "accessorg.h"

int getboolRunStop(char *charRunStop){
	int boolRunStop;
	char charStop[4], charRun[3];

	strcpy(charStop,"stop");
	strcpy(charRun, "run");

	if (strcmp(charRunStop,charStop) == 0)
	{
		boolRunStop = 0;
	}
	else if (strcmp(charRunStop,charRun) == 0)
	{
		boolRunStop = 1;
	}
	else
	{
		fprintf(stderr, "String comparison does not match: %s\n", strerror( errno ));
		return EXIT_FAILURE;
	}

	return boolRunStop;
}

char getcharRunStop(int boolRunStop){
		char charRunStop[5] = {};

		switch (boolRunStop){
		case 0:
			sprintf(charRunStop, "stop");
			break;
		case 1:
			sprintf(charRunStop, "run");
			break;
	}
		return *charRunStop;
}

int getRunStopStatus() {
	FILE *f = NULL;
	char DIR_getRunStopStatus[255] = {};
	char charRunStop[5] = {};
	char fopenModus[2] = {};
	int flag = 0, RunStopStatus;

	sprintf(DIR_getRunStopStatus, "/tmp/pushButtonSensingRunStop.txt");

	if (access(DIR_getRunStopStatus, (R_OK | W_OK)) != -1) {
		sprintf(fopenModus, "r+");
		flag = 0;
	} else {
		sprintf(fopenModus, "w");
		flag = 1;
	}

	if (flag == 0){
		f = fopen(DIR_getRunStopStatus, fopenModus);
		fread(charRunStop,sizeof(charRunStop),sizeof(charRunStop),f);
		sprintf(charRunStop,"%s%s",charRunStop,"\0");
		fclose(f);

		RunStopStatus = getboolRunStop(charRunStop);
	}
	else if(flag == 1){
		f = fopen(DIR_getRunStopStatus, fopenModus);
		sprintf(charRunStop, "stop");
		fwrite(charRunStop,5,5,f);
		fclose(f);
		RunStopStatus = 0;
	}
	return RunStopStatus;
}
//function to set file owner to www-data
void setfileown(char *DIR, char *uid_Name, char *gid_Name){
		char username[255];
		char groupname[255];
		long int uidresult[] = {0};
		long int gidresult[] = {0};
		long int uidowner[] = {0};
		long int gidowner[] = {0};
		long int uidresultgroup[] = {0};
		long int gidresultgroup[] = {0};
		long int fileprotection[] = {0};
		int filedesc;
	// Check if file has the defined uid (user ID) and gid (group ID)!
	filedesc = open(DIR, O_RDWR);

	getinfofile(&filedesc, uidowner, gidowner, fileprotection);

	//	printf("getinfofile call: \n uidowner : %li\n gidowner : %li\n fileprotection : %lo\n", uidowner[0], gidowner[0], fileprotection[0]);
	strcpy(username, uid_Name);
	getuidbyname(username, uidresult, gidresult);
	strcpy(groupname, gid_Name);
	getuidbyname(groupname, uidresultgroup, gidresultgroup);

	//	printf("Result of function call:\n uid : %li\n gid : %li\n", uidresult[0], gidresult[0]);


		if ((fchown(filedesc, uidresult[0], gidresult[0])) != 0){
			fprintf(stderr, "%s\n", strerror(errno));
		}

	close(filedesc);
}

void writeDigiInStatus(char *DigiInStatus) {
	FILE *f = NULL;
	char DIR_writeDigiInStatus[255] = {};
	char InStatus[255] = {};
	char fopenModus[2] = {};
	char buffer1[255] = {};
	int i = 0;

	sprintf(DIR_writeDigiInStatus, "/usr/lib/cgi-bin/pushButtonSensingDigiInStatus.txt");

	if (access(DIR_writeDigiInStatus, (R_OK | W_OK)) != -1){
		sprintf(fopenModus, "r+");
	} else {
		sprintf(fopenModus, "w");
		char uid[255] = {};
		char gid[255] = {};
		sprintf(uid, "root");
		sprintf(gid, "www-data");
		setfileown(DIR_writeDigiInStatus, uid, gid);
	}

	sprintf(buffer1,"%s",DigiInStatus);

	f = fopen(DIR_writeDigiInStatus, fopenModus);
	for (i=0; i<12; i++){
		sprintf(InStatus,"IN:%i:%c\n",i,buffer1[i]);
		fprintf(f,"%s",InStatus);
	}
	fclose(f);

}

int main(int argc, char *argv[], char *env[]){
	char SensingInput[14] = {};
	char InputStatusInit[14] = {};
	char InputStatusNew[14] = {'1','1','1','1','1','1','1','1','1','1','1','1'};
	char InputStatusOld[14]={'1','1','1','1','1','1','1','1','1','1','1','1'};
	char InputStatus[14]={'1','1','1','1','1','1','1','1','1','1','1','1'};
	int i = 0, runstop = 1, flagWriteDigiInStatus=0, sensingCycleTime;

/*
 * Get arguments what Inputs should be considered
 * for the pushButtonSensing.
 * 0 = sensing no
 * 1 = sensing yes
 */
	// Check arguments

	for (i=1;i<13;i++){
		printf("check argument %i: %c\n",i,argv[i][0]);

		if ((argv[i][0] != '0') && (argv[i][0] != '1')){
			fprintf(stderr, "Wrong argument value: %s\n", strerror( errno ));
			return EXIT_FAILURE;
		}

	}

		for (i=1;i<13;i++)
		{
			sscanf(argv[i],"%c",&SensingInput[i-1]);
		}

	if (argv[13]!=0)
	{
		sensingCycleTime = atoi(argv[13])*1000; //sensing in xx ms
	}
	else
	{
		sensingCycleTime = 80000; //standard sensing time if nothing is set
	}

	/*
	 * Write init status to file.
	 * This enables other interface processes like php to read the set sensing inputs.
	 */
		for (i=0;i<12;i++){
			if (SensingInput[i] == '0'){
				InputStatusInit[i] = 'N';
			}
			else if (SensingInput[i] == '1'){
				InputStatusInit[i] = '1'; // 1 Input 1 means low because of PNP (pull up)
			}
		}
		InputStatusInit[i] = '\0';
		writeDigiInStatus(InputStatusInit);

	while(runstop == 1)
	{

		/*
		 * get status of input channel
		 * 1 = low signal / 0 = high signal on input
		 * N = Is the marker that this channel is not considered for sensing.
		 */
		for (i=0;i<12;i++)
		{
			if (SensingInput[i] == '1')
			{

				InputStatusNew[i] =	gpio_get_value(IN_OUT_2[i][0])+'0'; //The 0 is necessary to convert int to char.

			}
			else
			{
				//Mark an Input which is not considered for pushButtonSensing.
				InputStatus[i] = 'N';
			}
			//It is only interesting to sense the 0 value.
			if ((InputStatusNew[i] == '0') && (InputStatusOld[i] == '1') && (InputStatus[i] != 'N'))
			{
				//change IN switch Status
				if (InputStatus[i] == '1')
					{InputStatus[i] = '0';}
				else if (InputStatus[i] == '0')
					{InputStatus[i] = '1';}

				//set write flag
				flagWriteDigiInStatus = -1;
			}
			//remember status to sense status change
				InputStatusOld[i] = InputStatusNew[i];
		}

		if (flagWriteDigiInStatus == -1)
		{
			writeDigiInStatus(InputStatus);
		}
		usleep(sensingCycleTime);
		//Without the getRunStopSatus() it is not possible to control the pushButtonSensing function.
		runstop = getRunStopStatus();
		//set variables to initial status
		flagWriteDigiInStatus = 0;
	}

	return 0;
}


/*
 * pushButtonSensing.c
 *
 *  Created on: 14.10.2015
 *  modified: 07.04.2021
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

int getboolRunStop(char *charRunStop){
	int boolRunStop;
	char charStop[5], charRun[4];

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
	char charRunStoptmp[5] = {};
	char fopenModus[3] = {};
	int flag = 0, RunStopStatus;

	sprintf(DIR_getRunStopStatus, "/var/www/tmp/pushButtonSensingRunStop.txt");

	if (access(DIR_getRunStopStatus, (R_OK | W_OK)) != -1) {
		sprintf(fopenModus, "r+");
		flag = 0;
	} else {
		sprintf(fopenModus, "w");
		flag = 1;
	}

	if (flag == 0){
		f = fopen(DIR_getRunStopStatus, fopenModus);
		fread(charRunStoptmp,sizeof(charRunStoptmp),sizeof(charRunStoptmp),f);
		sprintf(charRunStop,"%s%s",charRunStoptmp,"\0");
		fclose(f);

		RunStopStatus = getboolRunStop(charRunStop);
	}
	else if(flag == 1){
		f = fopen(DIR_getRunStopStatus, fopenModus);
		sprintf(charRunStop, "stop");
		fwrite(charRunStop,1,sizeof(charRunStop),f);
		fclose(f);
		RunStopStatus = 0;
	}
	return RunStopStatus;
}

//function get PushButton sensing Inputs from File
void getPushButtonInitStatus(int *numLines, char *InitToken) {
	FILE *f = NULL;
	char DIR_getPushButtonInitStatus[255] = {};
	char fopenModus[3] = {};
	char line[20][10];
	char *token;
	//char *tmpInitToken;
	char tmpToken[20];
	//char InitToken[20][2];
	int i = 0, k = 0;

	sprintf(DIR_getPushButtonInitStatus, "/var/www/tmp/pushButtonSensingDigiInStatus.txt");

	if (access(DIR_getPushButtonInitStatus, (R_OK | W_OK)) == -1) {
		fprintf(stderr, "/var/www/tmp/pushButtonSensingDigiInStatus.txt: %s\n", strerror( errno ));
		exit(1);
	}
	sprintf(fopenModus, "r+");

	f = fopen(DIR_getPushButtonInitStatus, fopenModus);
	while(fgets(line[i], 10, f))
	{

		token = strtok(line[i],":");

		while(token != NULL){
			//printf("token = %s\n", token);
			//memset(tmpToken,'\0',sizeof(tmpToken));
			//memset(InitToken[i],'$',1);
			strncpy(tmpToken,token,1);
			if(k == 2){
				sprintf(tmpToken,"%c",tmpToken[0]);
				InitToken[i] = tmpToken[0];
				//printf("InitToken = %c\n",InitToken[i]);
			}

			//printf("tmpToken = %c\n",tmpToken[0]);
			token = strtok(NULL,":");
			k++;
		}
		k = 0;
		i++;
	}
	fclose(f);

	numLines[0] = i;
}

void writeDigiInStatus(char *DigiInStatus, int numInputs) {
	FILE *f = NULL;
	char DIR_writeDigiInStatus[255] = {};
	char InStatus[255] = {};
	char fopenModus[3] = {};
	char buffer1[255] = {};
	int i = 0;

	sprintf(DIR_writeDigiInStatus, "/var/www/tmp/pushButtonSensingDigiInStatus.txt");
	/*for(i=0;i<numInputs;i++){
		printf("DigiIn: %c\n", DigiInStatus[i]);
	}
	*/
	if (access(DIR_writeDigiInStatus, (R_OK | W_OK)) == -1){
		fprintf(stderr, "/var/www/tmp/pushButtonSensingDigiInStatus.txt: %s\n", strerror( errno ));
		exit(1);
	} else {
		sprintf(fopenModus, "w");
	}

	sprintf(buffer1,"%s",DigiInStatus);

	f = fopen(DIR_writeDigiInStatus, fopenModus);
	for (i=0; i<numInputs; i++){
		sprintf(InStatus,"IN:%i:%c\n",i,buffer1[i]);
		fprintf(f,"%s",InStatus);
	}
	fclose(f);
}

int main(int argc, char *argv[], char *env[]){
	char SensingInput[10];
	char InputStatusNew[20];
	char InputStatusOld[20];
	//char InputStatus[20];
	int i = 0, runstop = 1, flagWriteDigiInStatus=0, sensingCycleTime;
	int numInputs[1];
	char input[1];

/*
 * Get arguments what Inputs should be considered
 * for the pushButtonSensing.
 * 0 = sensing no
 * 1 = sensing yes
 */

	sscanf(argv[1],"%c",&input[0]);


	if (input[0] == 'h'){
		printf("Description of function Button_Sensing:\n"
				"Button_Sensing [h,loop in ms]\n"
				"loop in ms: standard = 80 ms\n"
				"loop min in ms: 10 ms\n"
				"if loop in ms is not set => standard = 80 ms\n"
				"example: Button_Sensing h (get help)\n"
				"example: Button_Sensing 100 (sensing loop every 100 ms)\n");
		exit(1);
	}

	if (atoi(argv[1]) >= 10 && argc == 2)
	{
		sensingCycleTime = atoi(argv[1])*1000; //sensing in xx ms
	}
	else
	{
		sensingCycleTime = 80000; //standard sensing time if nothing is set
	}

	//printf("sensingCycleTime = %i\n",sensingCycleTime);

	getPushButtonInitStatus(numInputs, SensingInput);

	//printf("numInputs = %i\n",numInputs[i]);

	for (i=0;i<numInputs[0];i++){
		InputStatusNew[i] = '1';
		InputStatusOld[i] = '1';
	}
/*
	for(i=0;i<numInputs[0];i++){
		printf("InputStatus = %c\n",SensingInput[i]);
	}
*/
	while(runstop == 1)
	{

		/*
		 * Get Sensing Status from File.
		 */
		getPushButtonInitStatus(numInputs, SensingInput);


		/*
		 * get status of input channel
		 * 0 = low signal / 1 = high signal on input
		 * N = Is the marker that this channel is not considered for sensing.
		 */
		for (i=0;i<numInputs[0];i++)
		{
			if (SensingInput[i] == '0')
			{

				InputStatusNew[i] =	gpio_get_value(IN_OUT_3[i][0])+'0'; //The 0 is necessary to convert int to char.
				//printf("InputStatusNew = %c\n",InputStatusNew[i]);
			}

			//It is only interesting to sense the 1 value.
			if ((InputStatusNew[i] == '0') && (InputStatusOld[i] == '1') && (SensingInput[i] != 'N'))
			{
				//change IN switch Status
				if (SensingInput[i] == '1')
					{SensingInput[i] = '0';}
				else if (SensingInput[i] == '0')
					{SensingInput[i] = '1';}

				//set write flag
				flagWriteDigiInStatus = -1;
			}
			//remember status to sense status change
				InputStatusOld[i] = InputStatusNew[i];
		}
		/*
		for(i=0;i<numInputs[0];i++){
			printf("InputStatus_ = %c\n",SensingInput[i]);
		}
		 */

		if (flagWriteDigiInStatus == -1)
		{
			writeDigiInStatus(SensingInput, numInputs[0]);
		}

		usleep(sensingCycleTime);
		//Without the getRunStopSatus() it is not possible to control the pushButtonSensing function.
		runstop = getRunStopStatus();

		//printf("runstop = %i\n",runstop);

		//set variables to initial status
		flagWriteDigiInStatus = 0;
	}

	return 0;
}


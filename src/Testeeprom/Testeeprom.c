#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <unistd.h>
#include <errno.h>
#include <fcntl.h>
#include "accessorg.h"

int main(int argc, char *argv[], char *env[]){

#define AOUT_DIR "/usr/lib/cgi-bin/testuidgid.txt"

	FILE *f = NULL;
	char fopenModus[2] = {};
	char username[255];
	long int uidresult[] = {0};
	long int gidresult[] = {0};
	long int uidowner[] = {0};
	long int gidowner[] = {0};
	long int fileprotection[] = {0};


	int filedesc;

	//check if 2 arguments are set
	if (argc != 2){
		perror("Funktionsargument fehlt: <username>");
	}
	//get arguments from shell
	if (argv[1] != 0){
		strcpy (username, argv[1]);
	}

	if (access(AOUT_DIR, (R_OK | W_OK)) != -1) {
				sprintf(fopenModus, "r+");
				} else {
				sprintf(fopenModus, "w");
				}

			f = fopen(AOUT_DIR, fopenModus);
			fprintf(f,
					"Test Text: uid gid!!\n");
			fclose(f);
	// Check if file has the defined uid (user ID) and gid (group ID)!
		//  getinfofile(int *filedescr, uid_t *uidowner, gid_t *gidowner, mode_t *fileprotection);
			filedesc = open(AOUT_DIR, O_RDWR);

			getinfofile(&filedesc, uidowner, gidowner, fileprotection);

		//	printf("getinfofile call: \n uidowner : %li\n gidowner : %li\n fileprotection : %lo\n", uidowner[0], gidowner[0], fileprotection[0]);
		//	getuidinfo(char *name, long int *uidresult, long int *gidresult);
			getuidbyname(username, uidresult, gidresult);
		//	printf("Result of function call:\n uid : %li\n gid : %li\n", uidresult[0], gidresult[0]);

			if ((uidowner[0] != uidresult[0]) || (gidowner[0] != gidresult[0])){
				if ((fchown(filedesc, uidresult[0], gidresult[0])) != 0){
					fprintf(stderr, "init_AOUT (LTC2635): Change owner of %s error: %s\n",AOUT_DIR, strerror(errno));
					}
			}

			close(filedesc);

			return 0;
}

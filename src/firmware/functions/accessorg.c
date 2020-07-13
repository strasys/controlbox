/*
 * accessorg.c
 *
 *  Created on: 02.01.2016
 *      Author: Johannes Strasser
 *      Function to organize the Linux system:
 *      	access of files
 *      	UID / GID
 *			etc.
 */

#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <unistd.h>
#include <errno.h>
#include <pwd.h>
#include <sys/types.h>
#include <sys/stat.h>

void getuidbyname(char *name, long int *uidresult, long int *gidresult)
{
/*Function description:
 * struct passwd *getpwnam(const char *name);

   struct passwd *getpwuid(uid_t uid);

   int getpwnam_r(const char *name, struct passwd *pwd,
   	   char *buf, size_t buflen, struct passwd **result);

   int getpwuid_r(uid_t uid, struct passwd *pwd,
   	   char *buf, size_t buflen, struct passwd **result);

 * struct passwd {
 *   char   *pw_name;        username
 *   char   *pw_passwd;      user password
 *   uid_t   pw_uid;          user ID
 *   gid_t   pw_gid;          group ID
 *   char   *pw_gecos;        user information
 *   char   *pw_dir;          home directory
 *   char   *pw_shell;        shell program
 * 	};
*/
	long int uid, gid;
	struct passwd pwd;
	struct passwd *resultfunc;
	char *buf;
	size_t bufsize = 16384;
	int s;

	buf = malloc(bufsize);
	if (buf == NULL) {
		perror("malloc");
		exit(EXIT_FAILURE);
	}

	s = getpwnam_r(name, &pwd, buf, bufsize, &resultfunc);
	if (resultfunc == NULL) {
	        if (s == 0)
	            printf("accessorg.c: UID or GID not found!\n");
	        else {
	            errno = s;
	            perror("getpwnam_r");
	        }
	    }
	uid = pwd.pw_uid;
	gid = pwd.pw_gid;
	uidresult[0] = uid;
	gidresult[0] = gid;

}

void getinfofile(int *filedescr, long int *uidowner, long int *gidowner, long int *fileprotection){
/*
 * int fstat(int fd, struct stat *buf);
 * struct stat {
 *              dev_t     st_dev;          ID of device containing file
 *              ino_t     st_ino;          inode number
 *              mode_t    st_mode;         protection
 *              nlink_t   st_nlink;        number of hard links
 *              uid_t     st_uid;          user ID of owner
 *              gid_t     st_gid;          group ID of owner
 *              dev_t     st_rdev;         device ID (if special file)
 *              off_t     st_size;         total size, in bytes
 *              blksize_t st_blksize;      blocksize for filesystem I/O
 *              blkcnt_t  st_blocks;       number of 512B blocks allocated
*/

struct stat buf;

if (fstat(*filedescr, &buf) == -1)
	{
	fprintf(stderr, "getinfofile %s\n", strerror(errno));
	}

	uidowner[0] = buf.st_uid;
	gidowner[0] = buf.st_gid;
	fileprotection[0] = buf.st_mode;
//	printf ("uidowner : %li\n gidowner : %li\n fileportection %lo \n", uidowner[0], gidowner[0],  fileprotection[0]);
}


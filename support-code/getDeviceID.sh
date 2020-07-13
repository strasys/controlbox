#!/bin/sh
#Generate a device ID
#
#Seconds since Unix epoch
timestamp=$(date +%s)
random=$(head /dev/urandom | tr -dc A-Za-z0-9 | head -c50)
codevalue=$timestamp$random
echo $codevalue


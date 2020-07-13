#!/bin/sh
# Set of hostname
# Johannes Strasser
# 17.07.2016
# www.strasys.at
#
read -p "Please set new hostname:" newhostname 
wait
cd /etc/
wait
truncate -s 0 hostname
wait
echo $newhostname > hostname
wait
echo "New host name set to "$newhostname" !"
echo "To activate the new host name you have to reboot."
read -p "Would you like to reboot (strongly recommended)? (y/n)? " RESP
if [ "$RESP" = "y" ]; then
reboot
else
echo "Hostname set but not active.\n To set the hostname active please reboot the device!!"
exit 1
fi
wait


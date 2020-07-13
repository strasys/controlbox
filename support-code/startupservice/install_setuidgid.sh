#!/bin/sh
# Set the correct uid and gid of files
# Johannes Strasser
# 08.07.2017
# www.wistcon.at
#


#
#set uid, gid and access modes
#
echo "change user mode of init_wistcon-020.sh"
cd /usr/lib/cgi-bin/
chmod o+x init_wistcon-020.sh
echo "change gid and uid of GPIOin.xml and GPIOout.xml to www-data."
cd /var/www/
chown www-data:www-data VDF.xml
cd /var/secure/
echo "change gid und uid of user.txt"
chown www-data:www-data user.txt
wait
cd /usr/lib/cgi-bin/
echo "change user mode of init_wistcon-020.sh"
chmod 110 init_wistcon-020.sh
echo "change user mode of firmware"
chmod 110 firmware
echo "change user mode of RTChandler020"
chown root:www-data RTChandler020
chmod 4110 RTChandler020
echo "change user mode of PT1000handler_sensingbox"
chown root:www-data PT1000handler_sensingbox
chmod 4110 PT1000handler_sensingbox
echo "change user mode of GPIOhandler_020"
chown root:www-data GPIOhandler_020
chmod 4110 GPIOhandler_020
echo "change user mode of rweeprom"
chown root:www-data rweeprom
chmod 4110 rweeprom
echo "change user mode of set_hostname.sh"
chmod 110 set_hostname.sh
echo "change user mode of feuchte"
chown root:www-data feuchte
chmod 4110 feuchte

read -p "Would you like to change the hostname? (y/n)? " ANSW
if [ "$ANSW" = "y" ]; then
	./set_hostname.sh
else
	read -p "Would you like to continue to install the server components? (y/n)? " RESP
	if [ "$RESP" = "y" ]; then
		cd /tmp/
		chmod a+x install_apache2_php7.sh
		wait
		./install_apache2_php7.sh
	else
		echo "You stopped the installation after set of uid's and access modes.\n"	
		exit 1
	fi
fi


#!/bin/sh
# Installation script to start the initial installation process!
# Johannes Strasser
# 08.07.2017
# www.strasys.at
#
#Installation description:
#cd /tmp
#wget -nH -r -np --cut-dirs=3 http://HP-Max/wistcon/EL-100-020/vers1_0/startupservice/install_wistcon-020.sh
#chmod o+x install_privateplc.sh
#./install_wistcon-020.sh
#
#Fetch programm components from version server
#
#Ask user if the files should be fetched from the version server or transfered via sftp://
read -p "Would you like to fetch from version server or transfer the installation files manualy to tmp? ((m)anual/(f)etch)?" ANSW
if [ "$ANSW" = "f"]
then
	echo "Fetch files from software version server!\n"
	wget --no-host-directories --directory-prefix=/tmp/wistcon-020 --cut-dirs=3 --	recursive --no-parent http://HP-Max/wistcon/EL-100-020/wistcon-020_vers_1_0.tar
	wait
else
	read -p "Please transfer your wistcon-DRC-020.tar file to /tmp folder!
		And than press (s)tart!" ANSW
	if ["$ANSW" -ne "s"]
	then
		exit 1
	else 	
		echo "generate folder to extract"
		mkdir /tmp/wistcon-DRC-020/
		wait
		cd /tmp/
		echo "extracting ..."
		tar -xvf wistcon-DRC-020.tar -C /tmp/wistcon-DRC-020/ 
		wait
		echo "generate folder /var/secure/"
		mkdir /var/secure/
		wait
		echo "Copy password file user.txt to /var/secure/"
		cp /tmp/wistcon-DRC-020/webinterface/user.txt /var/secure/
		wait
		echo "remove user.txt from /tmp/wistcon-DRC-020/webinterface/"
		rm /tmp/wistcon-DRC-020/webinterface/user.txt
		wait
		echo "Copy webcontent to /var/www"
		cp -rT /tmp/wistcon-DRC-020/webinterface/ /var/www/
		wait
		echo "Copy firmware files to /usr/lib/cgi-bin"
		cp -rT /tmp/wistcon-DRC-020/firmware/ /usr/lib/cgi-bin/
		wait
		echo "Change drive /usr/lib/cgi-bin/"
		cd /usr/lib/cgi-bin/
		wait
		echo "Copy init_wistcon-php.service to /lib/systemd/system"
		cp init_wistcon-php.service /lib/systemd/system/
		wait		
		echo "Copy init_wistcon-020.service to /lib/systemd/system"
		cp init_wistcon-020.service /lib/systemd/system/
		wait
		echo "clean init_wistcon-020.service from /usr/lib/cgi-bin/"
		rm init_wistcon-020.service
		wait
		echo "Copy wistcon-DRC020-00A0.dtbo to /lib/firmware/"
		cp wistcon-DRC020-00A0.dtbo /lib/firmware/
		wait
		echo "Clean wistcon-DRC020-00A0.dtbo from /usr/lib/cgi-bin/"
		rm wistcon-DRC020-00A0.dtbo
		wait
		echo "move to /lib/systemd/system/"
		cd /lib/systemd/system/
		echo "enable init_wistcon-020.service"
		systemctl enable init_wistcon-020.service
		wait
		echo "start init_wistcon-020.service"
		systemctl start init_wistcon-020.service
		wait		
		echo "enable init_wistcon-php.service"
		systemctl enable init_wistcon-php.service
		wait		
		echo "start init_wistcon-php.service"
		systemctl start init_wistcon-php.service
		wait
	fi
fi

#Ask user what's next
read -p "Would you like to continue with change of uid gid of files? (y/n)? " RESP
if [ "$RESP" = "y" ]; then
	echo "change uid of install_setuidgid.sh"
	cd /tmp/
	wait
	chmod o+x install_setuidgid.sh
	wait
	./install_setuidgid.sh
else
	echo "Installation stopped after copy of components from version server.\n"
	exit 1
fi

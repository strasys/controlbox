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
#Ask user if the files should be fetched from the git server or transfered via sftp://

sudo apt-get update
wait
cd /tmp/wistcon-sensing/
wait
echo "generate folder /var/secure/"
mkdir /var/secure/
wait
echo "Copy password file user.txt to /var/secure/"
cp /tmp/wistcon-sensing/webinterface/user.txt /var/secure/
wait
echo "remove user.txt from /tmp/wistcon-sensing/webinterface/"
rm /tmp/wistcon-sensing/webinterface/user.txt
wait
echo "Copy webcontent to /var/www"
cp -rT /tmp/wistcon-sensing/webinterface/ /var/www/
wait
echo "Copy firmware files to /usr/lib/cgi-bin"
cp -rT /tmp/wistcon-sensing/firmware/ /usr/lib/cgi-bin/
wait
echo "Change drive /usr/lib/cgi-bin/"
cd /usr/lib/cgi-bin/
wait
echo "Copy WISTCON-SENSING-00A0.dtbo to /lib/firmware/"
cp WISTCON-SENSING20-00A0.dtbo /lib/firmware/
wait
echo "Clean WISTCON-SENSING-00A0.dtbo from /usr/lib/cgi-bin/"
rm WISTCON-SENSING20-00A0.dtbo
wait
echo "Install network-manager"
sudo apt-get install network-manager
wait
echo "install ntp"
sudo apt-get install ntp
wait
echo "generat tmp directory in /var/www/"
cd /var/www/
wait
sudo mkdir tmp
wait
echo "chmod a+xrw tmp"
sudo chmod a+xrw tmp
wait
echo "chown root:www-data tmp"
sudo chown root:www-data tmp
wait

#Ask user what's next
read -p "Would you like to continue with change of uid gid of files? (y/n)? " RESP
if [ "$RESP" = "y" ]; then
	echo "change uid of install_setuidgid.sh"
	cd /tmp/wistcon-sensing/
	wait
	chmod a+x install_setuidgid.sh
	wait
	sudo ./install_setuidgid.sh
else
	echo "Installation stopped after copy of components from version server.\n"
	exit 1
fi

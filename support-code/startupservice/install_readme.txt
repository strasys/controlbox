Installation of components
# Johannes Strasser
# 13.07.2020
# www.wistcon.at
#
# Installation for Debian 10.3
Installation steps:
Preparation:
set root file for apache server to /var/www/

0. make direktory and pull from git
mkdir /tmp/wistcon-control
cd /tmp/wistcon-control
git init
git pull https://github.com/strasys/controlbox_install.git
chmod a+x install_wistcon-control.sh
chmod a+x install_apache2_php7_3.sh
chmod a+x install_setuidgid.sh 

1. Open install_wistcon-sensing.sh

1.1. Read instructions in code

4.1. Check if apache files are correctly set up.
	/etc/apache2 ...
after changes do:
systemctl restart apache2.service
4.2.1 see boot/uEnv.txt
***** Start uEnv.txt ******
#Docs: http://elinux.org/Beagleboard:U-boot_partitioning_layout_2.0

uname_r=4.14.79-ti-r86
#uuid=
#dtb=

###U-Boot Overlays###
###Documentation: http://elinux.org/Beagleboard:BeagleBoneBlack_Debian#U-Boot_Overlays
###Master Enable
enable_uboot_overlays=1
###
###Overide capes with eeprom
#uboot_overlay_addr0=/lib/firmware/<file0>.dtbo
#uboot_overlay_addr1=/lib/firmware/<file1>.dtbo
#uboot_overlay_addr2=/lib/firmware/<file2>.dtbo
#uboot_overlay_addr3=/lib/firmware/<file3>.dtbo
###
###Additional custom capes
uboot_overlay_addr4=/lib/firmware/BB-I2C2-00A0.dtbo
uboot_overlay_addr5=/lib/firmware/BB-I2C1-00A0.dtbo
uboot_overlay_addr6=/lib/firmware/WISTCON-CONTROL-00A0.dtbo
#uboot_overlay_addr7=/lib/firmware/<file7>.dtbo
###
###Custom Cape
#dtb_overlay=/lib/firmware/WISTCON-SENSING20-00A0.dtbo
#dtb_overlay=/lib/firmware/BB-I2C2-00A0.dtbo
###
###Disable auto loading of virtual capes (emmc/video/wireless/adc)
#disable_uboot_overlay_emmc=1
disable_uboot_overlay_video=1
#disable_uboot_overlay_audio=1
disable_uboot_overlay_wireless=1
disable_uboot_overlay_adc=1
###
###PRUSS OPTIONS
###pru_rproc (4.4.x-ti kernel)
#uboot_overlay_pru=/lib/firmware/AM335X-PRU-RPROC-4-4-TI-00A0.dtbo
###pru_rproc (4.9.x-ti kernel)
#uboot_overlay_pru=/lib/firmware/AM335X-PRU-RPROC-4-9-TI-00A0.dtbo
###pru_rproc (4.14.x-ti kernel)
#uboot_overlay_pru=/lib/firmware/AM335X-PRU-RPROC-4-14-TI-00A0.dtbo
###pru_uio (4.4.x-ti, 4.9.x-ti, 4.14.x-ti & mainline/bone kernel)
#uboot_overlay_pru=/lib/firmware/AM335X-PRU-UIO-00A0.dtbo#
###Cape Universal Enable
#enable_uboot_cape_universal=1
###
###Debug: disable uboot autoload of Cape
disable_uboot_overlay_addr0=1
disable_uboot_overlay_addr1=1
disable_uboot_overlay_addr2=1
###
###U-Boot fdt tweaks... (60000 = 384KB)
#uboot_fdt_buffer=0x60000
###U-Boot Overlays###

cmdline=coherent_pool=1M net.ifnames=0 quiet

#In the event of edid real failures, uncomment this next line:
#cmdline=coherent_pool=1M net.ifnames=0 quiet video=HDMI-A-1:1024x768@60e

##enable Generic eMMC Flasher:
##make sure, these tools are installed: dosfstools rsync
#cmdline=init=/opt/scripts/tools/eMMC/init-eMMC-flasher-v3.sh
***Ende uEnv.txt*****

4.3. set user rights !!!
To change the password for a user:
sudo passwd username
		

4.4. enable network-manager => this enables hot plug
	/etc/network/interfaces
	Set as follows:
		#This file describes the network interfaces available on your system
		# and how to activate them. For more information, see interfaces(5).

		# The loopback network interface
		auto lo
		iface lo inet loopback

		# The primary network interface
		auto eth0
		allow-hotplug eth0
		iface eth0 inet static
			address 192.168.0.180
			netmask 255.255.255.0
			gateway 192.168.0.1
 
		# Example to keep MAC address between reboots
		hwaddress ether 04:a3:16:b3:5d:bc

		# The secondary network interface
		#auto eth1
		#iface eth1 inet dhcp

		# WiFi Example
		#auto wlan0
		#iface wlan0 inet dhcp
		#    wpa-ssid "essid"
		#    wpa-psk  "password"

		# Ethernet/RNDIS gadget (g_ether)
		# ... or on host side, usbnet and random hwaddr
		# Note on some boards, usb0 is automaticly setup with an init script
		#iface usb0 inet static
		#    address 192.168.7.2
		#    netmask 255.255.255.0
		#    network 192.168.7.0
		#    gateway 192.168.7.1


use: ifconfig -a to get the hardwareaddress	
	Install	network-manager
	apt-get install network-manager
	/etc/NetworkManager/NetworkManager.conf
		Set managed=true
	service network-manager restart

	Debian / Ubuntu Linux restart network interface

	To restart network interface, enter:
	sudo /etc/init.d/networking restart
	
	To stop and start use the following option (do not run them over remote ssh session as you will 	get disconnected):
	sudo /etc/init.d/networking stop
	sudo /etc/init.d/networking start

	Debian/Ubuntu Linux with systemd, run:
	$ sudo systemctl restart networking

4.5. enable ntp (Network Time Protocol)
	see: description Hetzner
	https://wiki.hetzner.de/index.php/Uhrzeit_synchronisieren_mit_NTP
	
	apt-get install ntp
	#got to : /etc/ntp.conf
	
	server  ntp1.hetzner.de  iburst
	server  ntp2.hetzner.com iburst
	server  ntp3.hetzner.net iburst

	restrict    default kod nomodify notrap nopeer noquery
	restrict -6 default kod nomodify notrap nopeer noquery

	restrict    127.0.0.1
	restrict -6 ::1

	//shell command:
	//synchronisierung der Uhr
	ntpd -q -g
	//die Uhr in die Hardwareclock schreiben
	hwclock --systohc
	//hwclock --systohc

4.6. set crone jobs
shell: crontab -e
add following in crontab -e
@reboot /usr/lib/cgi-bin/firmware
@reboot php /var/www/startupSetting.php

4.7. write EEPROM
sudo write.sh

Fehler - fixes Debian 10.3:
/etc/nginx/sites-available/default
=> default löschen, da sonst der Webserver nicht funktioniert.
Eine Möglichkeit:
sudo apt-get remove nginx



	


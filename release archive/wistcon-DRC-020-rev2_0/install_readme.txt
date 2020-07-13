Installation of components
# Johannes Strasser
# 15.10.2017
# www.wistcon.at
#

Installation steps:
1. Open install_wistcon-020.sh

1.1. Read instructions in code

2. install_setuidgid.sh

3. install_apache2_php5.sh

4. manual adjustments after installation steps 1 - 3

4.1. Check if apache files are correctly set up.
	/etc/apache2 ...

4.2. Set right CAPE: /etc/default/capemgr
	CAPE=wistcon-DRC020 (= example)
	Info: The file is the device tree file placed at
	/lib/firmware/wistcon-DRC020-00A0.dtbo
4.2.1 Disable pins in uEnv.txt
	=> uncomment the "Disable HDMI Line" 
	/boot/uEnv.txt
	=> ##Disable HDMI
	cape_disable=capemgr.disable_partno=BB-BONELT-HDMI,BB-BONELT-HDMIN

4.3. set user rights !!!
	see Unternehmensstrategie_2017

4.4. enable network-manager => this enables hot plug
	/etc/network/interfaces
	Set as follows:
		#This file describes the network interfaces available on your system
		# and how to activate them. For more information, see interfaces(5).

		# The loopback network interface
		auto lo
		iface lo inet loopback

		# The primary network interface
		#auto eth0
		#iface eth0 inet dhcp
		# Example to keep MAC address between reboots
		#hwaddress ether DE:AD:BE:EF:CA:FE

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
	Install	network-manager
	apt-get install network-manager
	service network-manager restart

4.5. enable ntp (Network Time Protocol)
	see: description Hetzner
	https://wiki.hetzner.de/index.php/Uhrzeit_synchronisieren_mit_NTP

	



sudo apt-get install git libdbus-1-dev bluez libdbus-glib-1-dev libglib2.0-dev libical-dev libreadline-dev libudev-dev libusb-dev glib2.0 bluetooth libbluetooth-dev make

bash <(curl -sL https://raw.githubusercontent.com/node-red/raspbian-deb-package/master/resources/update-nodejs-and-nodered)
sudo reboot
sudo hcitool lescan 

Note down/copy the flowerpower Mac Adresses somewhere

ctrl -c
cd ~
sudo npm install flower-power
--npm install mqtt --save
--sudo npm install mqtt -g
sudo npm install hashmap
sudo npm install --save async
sudo npm install noble

git clone https://github.com/Justinb81/domoticz-flower-power

cd domoticz-flower-power

node FP2DOM.js
sudo apt-get install git libdbus-1-dev bluez libdbus-glib-1-dev libglib2.0-dev libical-dev libreadline-dev libudev-dev libusb-dev glib2.0 bluetooth libbluetooth-dev

bash <(curl -sL https://raw.githubusercontent.com/node-red/raspbian-deb-package/master/resources/update-nodejs-and-nodered)
sudo reboot
sudo hcitool lescan 

Note down/copy the flowerpower Mac Adresses somewhere

ctrl -c
cd ~

git clone https://github.com/Justinb81/domoticz-flower-power

cd domoticz-flower-power

sudo npm install flower-power-ble
sudo npm install hashmap
sudo npm install async
sudo npm install noble
sudo npm install noble-device
sudo npm install requestify

Edit FP2DOM.js:

1, edit Domoticz address
2, fill your Domoticz's dummy device details and add your Flower Power MAC address (without colons):

//notation: ("flowerpowermac", IDXSUN-IDXSOILEC-IDXSOILTEMP-IDXAirtemp-IDXSoilM$
idConvertion.set("a0143d7d9338", "43-44-45-46-47");

Run project:

node ./FP2DOM.js a0143d0877f2


----
Mi Flora support

sudo npm install node-mi-flora

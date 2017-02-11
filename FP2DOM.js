 console.log('Processing: ' + process.argv[2]);


var DomSunlight = 0;
var DomSoilEC = 0;
var DomSoilTemp = 0;
var DomAirTemp = 0;
var DomSoilMoisture = 0;
var DomBatteryLevel = 0;
var DomSystemID = '-';
var SensorID = process.argv[2];
var requestify = require('requestify'); 
var async = require('async'); 
var HashMap = require('hashmap');
var FlowerPower = require('./indexFP'); 
var hasCalibratedData = false; 
var uuid = "undefined";
var battery = "0"; 



//Set up domoticz data
var DomoticzIP = "192.168.2.201:8080"


var idConvertion = new HashMap();
//notation: ("flowerpowermac", IDXSUN-IDXSOILEC-IDXSOILTEMP-IDXAirtemp-IDXSoilMoist)
idConvertion.set("a0143d0877f2", "510-509-511-508-507");
idConvertion.set("a0143d0d8a61", "519-516-520-518-521");
idConvertion.set("a0143d08b7da", "510-509-511-508-507");

  
  
  
  
  FlowerPower.discoverById(SensorID,function(flowerPower) { 
    async.series([ 
      function(callback) { 
        flowerPower.on('disconnect', function() { 
          console.log('disconnected!'); 
          process.exit(0); 
       
        }); 
  
        flowerPower.on('sunlightChange', function(sunlight) { 
          console.log('sunlight = ' + sunlight.toFixed(2) + ' mol/m²/d'); 
        }); 
  
         flowerPower.on('soilElectricalConductivityChange', function(soilElectricalConductivity) { 
           console.log('soil electrical conductivity = ' + soilElectricalConductivity.toFixed(2)); 
         }); 
  
        flowerPower.on('soilTemperatureChange', function(temperature) { 
          console.log('soil temperature = ' + temperature.toFixed(2) + '°C'); 
        }); 
  
        flowerPower.on('airTemperatureChange', function(temperature) { 
          console.log('air temperature = ' + temperature.toFixed(2) + '°C'); 
        }); 
  
        flowerPower.on('soilMoistureChange', function(soilMoisture) { 
          console.log('soil moisture = ' + soilMoisture.toFixed(2) + '%'); 
        }); 
  
        flowerPower.on('calibratedSoilMoistureChange', function(soilMoisture) { 
          console.log('calibrated soil moisture = ' + soilMoisture.toFixed(2) + '%'); 
        }); 
  
        flowerPower.on('calibratedAirTemperatureChange', function(temperature) { 
          console.log('calibrated air temperature = ' + temperature.toFixed(2) + '°C'); 
        }); 
  
        flowerPower.on('calibratedSunlightChange', function(sunlight) { 
          console.log('calibrated sunlight = ' + sunlight.toFixed(2) + ' mol/m²/d'); 
        }); 
  
        flowerPower.on('calibratedEaChange', function(ea) { 
          console.log('calibrated EA = ' + ea.toFixed(2)); 
        }); 
  
        flowerPower.on('calibratedEcbChange', function(ecb) { 
          console.log('calibrated ECB = ' + ecb.toFixed(2) + ' dS/m'); 
        }); 
  
        flowerPower.on('calibratedEcPorousChange', function(ecPorous) { 
          console.log('calibrated EC porous = ' + ecPorous.toFixed(2)+ ' dS/m'); 
        }); 
  
        console.log('serial id of this flowerpower : ' + flowerPower.uuid);
        uuid = flowerPower.uuid;
        console.log('connectAndSetup'); 
        flowerPower.connectAndSetup(callback); 
      }, 
      function(callback) { 
        console.log('readSystemId'); 
        flowerPower.readSystemId(function(error, systemId) { 
          console.log('\tsystem id = ' + systemId); 
          DomSystemID  = systemId;
          callback(); 
        }); 
      }, 
      function(callback) { 
        console.log('readSerialNumber'); 
        flowerPower.readSerialNumber(function(error, serialNumber) { 
          console.log('\tserial number = ' + serialNumber); 
          callback(); 
        }); 
      }, 
      function(callback) { 
        console.log('readFirmwareRevision'); 
        flowerPower.readFirmwareRevision(function(error, firmwareRevision) { 
          console.log('\tfirmware revision = ' + firmwareRevision); 
  
          var version = firmwareRevision.split('_')[1].split('-')[1]; 
  
          hasCalibratedData = (version >= '1.1.0'); 
  
          callback(); 
        }); 
      }, 
      function(callback) { 
        console.log('readHardwareRevision'); 
        flowerPower.readHardwareRevision(function(error, hardwareRevision) { 
          console.log('\thardware revision = ' + hardwareRevision); 
          callback(); 
        }); 
      }, 
      function(callback) { 
        console.log('readManufacturerName'); 
        flowerPower.readManufacturerName(function(error, manufacturerName) { 
          console.log('\tmanufacturer name = ' + manufacturerName); 
          callback(); 
        }); 
      }, 
      function(callback) { 
        console.log('readBatteryLevel'); 
        flowerPower.readBatteryLevel(function(error, batteryLevel) { 
          console.log('battery level = ' + batteryLevel); 
          DomBatteryLevel = batteryLevel;
          callback(); 
        }); 
      }, 
  
  
      //Causes disconnect, do not use
      /* 
      function(callback) { 
        console.log('readFriendlyName'); 
        flowerPower.readFriendlyName(function(error, friendlyName) { 
          console.log('\tfriendly name = ' + friendlyName); 
  
          console.log('writeFriendlyName'); 
          flowerPower.writeFriendlyName(friendlyName, callback); 
        }); 
      }, 
      */ 
  
      function(callback) { 
        console.log('readColor'); 
        flowerPower.readColor(function(error, color) { 
          console.log('\tcolor = ' + color); 
  
          callback(); 
        }); 
      }, 
      function(callback) { 
        console.log('readSunlight'); 
        flowerPower.readSunlight(function(error, sunlight) { 
          console.log('sunlight = ' + sunlight.toFixed(2) + ' mol/m²/d'); 
          DomSunlight = sunlight.toFixed(2);
          callback(); 
        }); 
      }, 
       function(callback) { 
         console.log('readSoilElectricalConductivity'); 
         flowerPower.readSoilElectricalConductivity(function(error, soilElectricalConductivity) { 
           console.log('soil electrical conductivity = ' + soilElectricalConductivity.toFixed(2)); 
           DomSoilEC = soilElectricalConductivity.toFixed(2);
           callback(); 
         }); 
       }, 
      function(callback) { 
        console.log('readSoilTemperature'); 
        flowerPower.readSoilTemperature(function(error, temperature) { 
          console.log('soil temperature = ' + temperature.toFixed(2) + '°C'); 
          DomSoilTemp = temperature.toFixed(2);
          callback(); 
        }); 
      }, 
      function(callback) { 
        console.log('readAirTemperature'); 
        flowerPower.readAirTemperature(function(error, temperature) { 
          console.log('air temperature = ' + temperature.toFixed(2) + '°C'); 
          DomAirTemp = temperature.toFixed(2);
          callback(); 
        }); 
      }, 
      function(callback) { 
        console.log('readSoilMoisture'); 
        flowerPower.readSoilMoisture(function(error, soilMoisture) { 
          console.log('soil moisture = ' + soilMoisture.toFixed(2) + '%'); 
          DomSoilMoisture = soilMoisture.toFixed(2);
          callback(); 
        }); 
      }, 
      function(callback) { 
        if (hasCalibratedData) { 
          async.series([ 
            function(callback) { 
              console.log('readCalibratedSoilMoisture'); 
              flowerPower.readCalibratedSoilMoisture(function(error, soilMoisture) { 
                console.log('calibrated soil moisture = ' + soilMoisture.toFixed(2) + '%'); 
                  DomSoilMoisture = soilMoisture.toFixed(2);
                callback(); 
              }); 
            }, 
            function(callback) { 
              console.log('readCalibratedAirTemperature'); 
              flowerPower.readCalibratedAirTemperature(function(error, temperature) { 
                console.log('calibrated air temperature = ' + temperature.toFixed(2) + '°C'); 
                   DomAirTemp = temperature.toFixed(2);
                callback(); 
              }); 
            }, 
            function(callback) { 
              console.log('readCalibratedSunlight'); 
              flowerPower.readCalibratedSunlight(function(error, sunlight) { 
                console.log('calibrated sunlight = ' + sunlight.toFixed(2) + ' mol/m²/d'); 
               DomSunlight = sunlight.toFixed(2);
                callback(); 
              }); 
            }, 
  
  
            //Calibrated Soil readings does not work, causes disconnect. Do not use
            /* 
            function(callback) { 
              console.log('readCalibratedEa'); 
              flowerPower.readCalibratedEa(function(error, ea) { 
                console.log('calibrated EA = ' + ea.toFixed(2)); 
  
                callback(); 
              }); 
            }, 
  
  
            function(callback) { 
              console.log('readCalibratedEcb'); 
              flowerPower.readCalibratedEcb(function(error, ecb) { 
                console.log('calibrated ECB = ' + ecb.toFixed(2) + ' dS/m'); 
  
                callback(); 
              }); 
            }, 
            function(callback) { 
              console.log('readCalibratedEcPorous'); 
              flowerPower.readCalibratedEcPorous(function(error, ecPorous) { 
                console.log('calibrated EC porous = ' + ecPorous.toFixed(2) + ' dS/m'); 
  
                callback(); 
              }); 
            }, 
            */ 
  
  
  
            function() { 
                  console.log('uuid = ' + uuid);
                  console.log('System ID = ' + DomSystemID);
                  console.log('DomSunlight result = ' + DomSunlight);
                  console.log('DomSoilEC result = ' + DomSoilEC);
                  console.log('DomSoilTemp result = ' + DomSoilTemp);
                  console.log('DomAirTemp result = ' + DomAirTemp);
                  console.log('DomSoilMoisture result = ' + DomSoilMoisture);
                  console.log('DomBatteryLevel result = ' + DomBatteryLevel);
              //Create Domoticz update strings
              //FIND IDX's for System ID
               if(idConvertion.has(uuid)) {
  		        id = idConvertion.get(uuid);
  		        var idxarray = id.split("-");
              //Create Domoticz update strings
              //Execute Domoticz update strings		        
                  console.log('IDX DomSunlight = ' + idxarray[0]);
                  var SunPost = '/json.htm?type=command&param=udevice&idx=' + idxarray[0] + '&nvalue=0&svalue=' + DomSunlight + 'TEMP&battery=' + DomBatteryLevel;
                  requestify.post('http://' + DomoticzIP + SunPost, { })
                
                  console.log('IDX DomSoilEC = ' + idxarray[1]);
                  var SoilECPost = '/json.htm?type=command&param=udevice&idx=' + idxarray[1] + '&nvalue=0&svalue=' + DomSoilEC + 'TEMP&battery=' + DomBatteryLevel;
                  requestify.post('http://' + DomoticzIP + SoilECPost, { })
               
                  console.log('IDX DomSoilTemp = ' + idxarray[2]);
                  var SoilTempPost = '/json.htm?type=command&param=udevice&idx=' + idxarray[2] + '&nvalue=0&svalue=' + DomSoilTemp + 'TEMP&battery=' + DomBatteryLevel;
                  requestify.post('http://' + DomoticzIP + SoilTempPost, { })
                      
                  console.log('IDX DomAirTemp = ' + idxarray[3]);
                  var AirTempPost = '/json.htm?type=command&param=udevice&idx=' + idxarray[3] + '&nvalue=0&svalue=' + DomAirTemp + 'TEMP&battery=' + DomBatteryLevel;
                  requestify.post('http://' + DomoticzIP + AirTempPost, { })          
  
                  console.log('IDX DomSoilMoisture = ' + idxarray[4]);
                  var SoilMoisturePost = '/json.htm?type=command&param=udevice&idx=' + idxarray[4] + '&nvalue=0&svalue=' + DomSoilMoisture + 'TEMP&battery=' + DomBatteryLevel;
                  requestify.post('http://' + DomoticzIP + SoilMoisturePost, { })
       
                              
  
  		        
  	         }
  
          
                  
                  
                  
              callback(); 
            } 
          ]); 
        } else { 
          callback(); 
        } 
      }, 
  
  
      //Turned off Live mode, uses too much battery
      /* 
      function(callback) { 
        console.log('enableLiveMode'); 
        flowerPower.enableLiveMode(callback); 
      }, 
      function(callback) { 
        console.log('live mode'); 
        setTimeout(callback, 5000); 
      }, 
      function(callback) { 
        console.log('disableLiveMode'); 
        flowerPower.disableLiveMode(callback); 
      }, 
      function(callback) { 
        if (hasCalibratedData) { 
          async.series([ 
            function(callback) { 
              console.log('enableCalibratedLiveMode'); 
              flowerPower.enableCalibratedLiveMode(callback); 
            }, 
            function(callback) { 
              console.log('calibrated live mode'); 
              setTimeout(callback, 5000); 
            }, 
            function(callback) { 
              console.log('disableCalibratedLiveMode'); 
              flowerPower.disableCalibratedLiveMode(callback); 
            }, 
            function() { 
              callback(); 
            } 
          ]); 
        } else { 
          callback(); 
        } 
      }, 
      */ 
      
      //Consider commenting out the LedPulse and LedOff to save battery,
      function(callback) { 
        console.log('ledPulse'); 
        flowerPower.ledPulse(callback); 
      }, 
      
      //Keep Delay in or increase
      function(callback) { 
        console.log('delay'); 
        setTimeout(callback, 5000); 
      }, 
      function(callback) { 
        console.log('ledOff'); 
        flowerPower.ledOff(callback); 
      }, 
      function(callback) { 
        console.log('disconnect'); 
        flowerPower.disconnect(callback); 
      } 
    ]); 
  });

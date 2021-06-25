const { contextBridge, ipcRenderer } = require('electron');
const path = require('path')
const { readdirSync } = require('fs');
const heartRateAPI = require('./heart-rate/heart-rate-ble');
const heartRateUtils = require('./heart-rate/heart-rate-utils');

let heartRateService = {};

contextBridge.exposeInMainWorld(
  'api', {
  devicesFound: (callback) => {
    ipcRenderer.on('devices-found', (_, devices) => {
      callback(devices);
    })
  },
  selectDevice: (deviceId) => ipcRenderer.send('select-device', deviceId),
  initBLESearch: async () => heartRateService = await heartRateAPI.initService(),
  subscribeToHeartRateMeasurement: (callback) => {
    heartRateService.subscribeToHeartRateMeasurement(
      (ev) => callback(heartRateUtils.parseHeartRateData(ev.currentTarget.value))
    )
  },
  subscribeToCharacteristic: (characteristic, callback) => heartRateService.subscribeToCharacteristic(characteristic, callback),
  readCharacteristic: async (characteristic) => await heartRateService.readCharacteristic(characteristic),
  parseHeartRate: (rawData) => heartRateUtils.parseHeartRateData(rawData),
  getAllViews: () => {
    let basePath = path.join(__dirname, "monitors/").replace("app.asar", ""); 
    return readdirSync(basePath, { withFileTypes: true })
      .filter(f => f.isDirectory())
      .map(f => path.join(basePath, `${f.name}`))
  }
});
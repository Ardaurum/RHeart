const HeartRateService = require("./heart-rate-service");

const heartRateAPI = {
  async initService() {
    try {
      const device = await navigator.bluetooth.requestDevice({ filters: [{ services: ['heart_rate'] }] });

      console.log("Connecting to GATT Server Of Device: " + device);
      const server = await device.gatt.connect();

      console.log("Getting Heart Rate Service From Server: " + server);
      const service = await server.getPrimaryService('heart_rate');

	  return new HeartRateService(service);
    } catch (error) {
      console.error("Error with getting BLE device: " + error)
    }
  }
}

module.exports = heartRateAPI;
module.exports = class HeartRateService {
  constructor(service) {
    this.service = service;
    this.characteritics = [];
  }

  async subscribeToHeartRateMeasurement(callback) {
    await this.subscribeToCharacteristic('heart_rate_measurement', callback);
  }

  async subscribeToCharacteristic(characteristic, callback) {
    let current = null;
    if (characteristic in this.characteritics == false)
    {
      current = await this.service.getCharacteristic(characteristic);
      await current.startNotifications();
      this.characteritics[characteristic] = current;
    }
    else
    {
      current = characteristic[characteristic];
    }

    current.addEventListener('characteristicvaluechanged', callback);
  }

  async readCharacteristic(characteristic) {
    let current = null;
    if (characteristic in this.characteritics == false)
    {
      current = this.service.getCharacteristic(characteristic);
      this.characteritics[characteristic] = current;
    }
    else
    {
      current = this.characteritics[characteristic];
    }
    
    current.readValue();
  }
}
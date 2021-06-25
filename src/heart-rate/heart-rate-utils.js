const heartRateUtils = {
  parseHeartRateData(data) {
    let value = data.buffer ? data : new DataView(data);
    let flags = value.getUint8(0);
    let result = {}
    let is16Bits = !!(flags & 0x1);
    result.contactDetected = !!(flags & 0x6);
    result.energyExpendedPresent = !!(flags & 0x8);
    result.rrIntervalsPresent = !!(flags & 0x10);

    result.heartRate = is16Bits ? value.getUint16(1, false) : value.getUint8(1);

    offset = is16Bits ? 3 : 2;
    if (result.enegryExpendedPresent)
    {
      result.enegryExpended = value.getUint16(offset, false);
      offset += 2;
    }
    
    if (result.rrIntervalsPresent)
    {
      let rrIntervals = [];
      for (; offset + 1 < value.byteLength; offset += 2) {
        rrIntervals.push(value.getUint16(offset, false));
      }
      result.rrIntervals = rrIntervals;
    }

    return result;
  }
}

module.exports = heartRateUtils;
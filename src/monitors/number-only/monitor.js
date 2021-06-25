$(() => {
  window.api.subscribeToHeartRateMeasurement(onHeartRate);

  const avgWindow = 5;
  const heartRateArray = [];

  function onHeartRate(data) {
    heartRateArray.push(data.heartRate);
    if (heartRateArray.length > avgWindow)
    {
      heartRateArray.shift();
    }
    let sum = heartRateArray.reduce((a, b) => a + b);
    let avg = sum / heartRateArray.length;
    $("#heart-rate").text(Math.round(avg));
  }
})
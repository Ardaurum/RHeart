$(() => {
  window.api.subscribeToHeartRateMeasurement(onHeartRate);

  const svg = document.getElementById('heart-svg');
  const svgWidth = svg.getAttribute('viewBox').split(" ")[2];
  const svgHeight = svg.getAttribute('viewBox').split(" ")[3];
  const polyline = document.getElementById('heart-line');

  const rateRange = {min: 0, max: 200};
  const updateTime = 16;
  const pointDistance = 0.1;

  let lastHeartRate = 0;
  let newHeartRate = 0;

  function onHeartRate(data) {
    newHeartRate = Math.max(Math.min((data.heartRate - rateRange.min) / rateRange.max, 1), 0);
    newHeartRate = 1 - newHeartRate;
    newHeartRate *= svgHeight;
  }

  setInterval(function () {
    let currentHeartRate = (newHeartRate + lastHeartRate) / 2.0;
    lastHeartRate = currentHeartRate;
    console.log(currentHeartRate);

    let pointsString = polyline.getAttribute('points');
    let points = pointsString.split(" ");
    let resultPoints = ["0,32"];
    let index = 0;
    for (let i = 0; i < points.length; i++) {
      let point = points[i].split(",");
      point[0] = point[0] - pointDistance;
      index = point[0] < 0 ? 0 : index + 1;
      resultPoints[index] = `${point[0]},${point[1]}`;
	  }
    resultPoints[index + 1] = `${svgWidth},${currentHeartRate}`;
    polyline.setAttribute('points', resultPoints.join(" "));
  }, updateTime);
})
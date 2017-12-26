function charts(elem, arr) {
  console.log(arr);

  var labels = [];
  for (let i = 0; i <= arr.length - 1; i++) {
    labels[i] = arr[i].city.name;
  }

  var temp = [];
  for (let i = 0; i <= arr.length - 1; i++) {
    temp[i] = arr[i].weather.main.temp;
  }

  var dataTemperature = {
    label: "Temperature (*C)",
    data: temp,
    lineTension: 0.3,
    fill: false,
    borderColor: 'red',
    backgroundColor: 'transparent',
    pointBorderColor: 'red',
    pointBackgroundColor: 'lightgreen',
    pointRadius: 5,
    pointHoverRadius: 15,
    pointHitRadius: 30,
    pointBorderWidth: 2,
    pointStyle: 'rect'
  };

  var dataSecond = {
    label: "Car B - Speed (mph)",
    data: [20, 15, 60, 60, 65, 30, 70],
    lineTension: 0.3,
    fill: false,
    borderColor: 'purple',
    backgroundColor: 'transparent',
    pointBorderColor: 'purple',
    pointBackgroundColor: 'lightgreen',
    pointRadius: 5,
    pointHoverRadius: 15,
    pointHitRadius: 30,
    pointBorderWidth: 2
  };

  var routeData = {
    labels: labels,
    datasets: [dataTemperature], //dataSecond]
  };

  var chartOptions = {
    legend: {
      display: true,
      position: 'top',
      labels: {
        boxWidth: 80,
        fontColor: 'black'
      }
    }
  };

  var ctx = document.getElementById(elem).getContext('2d');
  var myChart = new Chart(ctx, {
    type: 'line',
    data: routeData,
    options: chartOptions
  });
}


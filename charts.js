function drawChart(chartCanvas, arr) {
  console.log(arr);

  var labels = [];
  for (let i = 0; i <= arr.length - 1; i++) {
    labels[i] = arr[i].city.name;
  }

  var temp = [];
  for (let i = 0; i <= arr.length - 1; i++) {
    temp[i] = arr[i].weather.main.temp;
  }

  var wind = [];
  for (let i = 0; i <= arr.length - 1; i++) {
    wind[i] = arr[i].weather.wind.speed;
  }

  var precipitation = [];
  for (let i = 0; i <= arr.length - 1; i++) {
    console.log(precipitation);
    if (arr[i].weather.snow) {
      precipitation[i] = arr[i].weather.snow['3h'];
      continue;
    }
    precipitation[i] = arr[i].weather.rain['3h'];
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
    pointHoverRadius: 10,
    pointHitRadius: 10,
    pointBorderWidth: 2,
    pointStyle: 'rect',
    yAxisID: "y-axis-1"
  };

  var dataPrecipitation = {
    label: "Precipitation (mm/3h)",
    data: precipitation,
    lineTension: 0.3,
    fill: false,
    borderColor: 'purple',
    backgroundColor: 'transparent',
    pointBorderColor: 'purple',
    pointBackgroundColor: 'lightgreen',
    pointRadius: 5,
    pointHoverRadius: 10,
    pointHitRadius: 10,
    pointBorderWidth: 2,
    yAxisID: "y-axis-2"
  };

  var routeData = {
    labels: labels,
    datasets: [dataTemperature, dataPrecipitation]
  };

  var chartOptions = {
    legend: {
      display: true,
      position: 'top',
      labels: {
        boxWidth: 80,
        fontColor: 'black'
      }
    },
    title: {
      display: false,
      text: 'Weather on road'
    },
    scales: {
      yAxes: [{
        type: "linear",
        display: true,
        position: "left",
        id: "y-axis-1",
      }, {
        type: "linear",
        display: true,
        position: "right",
        id: "y-axis-2",

        gridLines: {
          drawOnChartArea: false,
        },
      }],
    }
  }
  
  if(myChart!=null){
    myChart.destroy();
  }
  
  var ctx = document.getElementById(chartCanvas).getContext("2d");
  myChart = new Chart(ctx, {
    type: 'line',
    data: routeData,
    options: chartOptions
  });

  document.getElementById(chartCanvas).onmousemove = function (evt) {
    var activePoints = myChart.getElementAtEvent(evt);

    if (activePoints.length > 0) {
      //get the internal index of slice in pie chart`
      var clickedElementindex = activePoints[0]["_index"];

      //get specific label by index 
      var label = myChart.data.labels[clickedElementindex];

      //get value by index      
      var value = myChart.data.datasets[0].data[clickedElementindex];

      console.log(clickedElementindex);

      /* other stuff that requires slice's label and value */
    }
  }

}


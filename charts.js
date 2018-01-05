'use strict';
/**
 * A class which providing all chart drawning functions.
 */

class Charts {

  constructor(mountPointChart) {
    this.stepArr = null;
    this.mountPointChart = mountPointChart;

    this.chartOptions = {
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
    this.datasetLeft = {
      label: "datasetLeft (UOM)",
      data: null,
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
    this.datasetRight = {
      label: "datasetRight (UOM)",
      data: null,
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

  }

  plotData(stepArr, curve1, curve2) {
    this.stepArr = stepArr;
    var routeData = {
      labels: this._getData('labels'),
      datasets: [this._getDataset(curve1, 'left'), this._getDataset(curve2, 'right')]
    };

    console.log(routeData);


  }

  _getDataset(param, place) {
    console.log(param, place);
  }

  _getData(param) {
    var stepArr = this.stepArr;

    console.log(param);

    let outputArr = [];

    switch (param) {
      case 'labels':
        for (let i = 0; i <= stepArr.length - 1; i++) {
          outputArr[i] = stepArr[i].city.name;
        }
        return outputArr;
        break;

      case 'temperature':
        for (let i = 0; i <= stepArr.length - 1; i++) {
          outputArr[i] = stepArr[i].weather.main.temp;
        }
        return outputArr;
        break;

      case 'precipitation':
        for (let i = 0; i <= stepArr.length - 1; i++) {
          let prec = 0;
          if (stepArr[i].weather.snow) {
            if (stepArr[i].weather.snow['3h']) {
              prec += stepArr[i].weather.snow['3h'];
            }
          }
          if (stepArr[i].weather.rain) {
            if (stepArr[i].weather.rain['3h']) {
              prec += stepArr[i].weather.rain['3h'];
            }
          }

          outputArr[i] = prec;
        }
        return outputArr;
        break;

      case 'wind':
        for (let i = 0; i <= stepArr.length - 1; i++) {
          outputArr[i] = stepArr[i].weather.wind.speed;
        }
        return outputArr;
        break;

      case 'clouds':
        for (let i = 0; i <= stepArr.length - 1; i++) {
          outputArr[i] = stepArr[i].weather.clouds.all;
        }
        return outputArr;
        break;

      default:
        return outputArr;
    }

  }

}

function drawChart(chartCanvas, arr) {
  console.log(arr);

  var labels = [];
  for (let i = 0; i <= arr.length - 1; i++) {
    labels[i] = arr[i].city.name;
  }

  var temperature = [];
  for (let i = 0; i <= arr.length - 1; i++) {
    temperature[i] = arr[i].weather.main.temp;
  }

  var wind = [];
  for (let i = 0; i <= arr.length - 1; i++) {
    wind[i] = arr[i].weather.wind.speed;
  }

  var precipitation = [];
  for (let i = 0; i <= arr.length - 1; i++) {
    let prec = 0;
    //console.log(precipitation);
    if (arr[i].weather.snow) {
      if (arr[i].weather.snow['3h']) {
        prec += arr[i].weather.snow['3h'];
      }
    }
    if (arr[i].weather.rain) {
      if (arr[i].weather.rain['3h']) {
        prec += arr[i].weather.rain['3h'];
      }
    }

    precipitation[i] = prec;
  }

  var dataTemperature = {
    label: "Temperature (*C)",
    data: temperature,
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

  if (myChart != null) {
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


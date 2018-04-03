'use strict';
/**
 * A class which providing all chart drawning functions.
 */

class Charts {

  /**
   * Constructor creates new Charts obj and view it on element with #mp
   * @param {string} mp id of <div> element to mount charts
   * @return {Object} instance of Charts class
   */
  constructor(mp) {
    this.myChart = null;
    this.stepArr = null;
    this.mountPointChart = document.getElementById(mp);

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
        xAxes: [{
          ticks: {
            autoSkip: false,
            maxRotation: 90,
            minRotation: 90
          }
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

  /**
   * A method wich creates a chart in div defined as constructor argument.
   * curve options available: 'temperature', 'precipitation', 'wind', 'clouds'.
   * @param {Object} stepArr array with step combined with weather data
   * @param {string} curve1 curve parameter for left chart
   * @param {string} curve2 curve parameter for right chart
   * @return {none}
   */
  plotData(stepArr, curve1, curve2) {
    this.stepArr = stepArr;
    var routeData = {
      labels: this._getData('labels'),
      datasets: [this._getDataset(curve1, 'left'), this._getDataset(curve2, 'right')]
    };
    console.log('Charts class routeData: ', routeData);

    if (this.myChart != null) {
      this.myChart.destroy();
    }

    var ctx = this.mountPointChart.getContext('2d');
    this.myChart = new Chart(ctx, {
      type: 'line',
      data: routeData,
      options: this.chartOptions
    });

  }

  /**
   * A method wich returns chart label according to input parameter.
   * Params available: 'temperature', 'precipitation', 'wind', 'clouds'.
   * Returns appropriate label for chart
   * @param {string} param to display
   * @return {*} label 
   */
  _getLabelForDataset(param) {
    switch (param) {
      case 'temperature':
        var label = 'Temperature (*C)'
        return label;
        break;

      case 'precipitation':
        var label = 'Precipitation (mm/3h)'
        return label;
        break;

      case 'wind':
        var label = 'Wind speed (m/s)'
        return label;
        break;

      case 'clouds':
        var label = 'Cloudness (%)'
        return label;
        break;

      default:
        console.error("no label for: ", param);
        return null;
    }
  }

  /**
   * A method wich returns dataset according to input parameters.
   * Params currently available: 'temperature', 'precipitation', 'wind', 'clouds'.
   * Placements currently available: 'left', 'right'.
   * @param {string} param a curve to build in a chart
   * @param {string} placement chart 'y' axis position on chart panel
   * @return {Object} dataset according to input data
   */
  _getDataset(param, placement) {
    var that = this;

    switch (placement) {
      case 'left':
        that.datasetLeft.label = that._getLabelForDataset(param);
        that.datasetLeft.data = that._getData(param);
        return that.datasetLeft;
        break;

      case 'right':
        that.datasetRight.label = that._getLabelForDataset(param);
        that.datasetRight.data = that._getData(param);
        return that.datasetRight;
        break;

      default:
        console.error("no dataset for: ", placement);
        return null;
    }
  }

  /**
   * A method wich returns data according to input parameters. It gets data from input stepArr.
   * Params currently available: 'temperature', 'precipitation', 'wind', 'clouds'.
   * @param {string} param a data to extract from input stepArr.
   * @return {Object[]} array with all data with defined parameter.
   */
  _getData(param) {
    var stepArr = this.stepArr;

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
        console.error("no data for: ", param);
        return outputArr;
    }

  }

  /**
   * A method wich adds event listener on onmousemove over data dots on chart.
   * As soon mouse is over dot callback 'fu' is called.
   * @param {function} fu callback function to call on event
   * @return none
   */
  addEventListenerOnMouseMove(fu) {
    var that = this;
    this.mountPointChart.onmousemove = function (evt) {
      var activePoints = that.myChart.getElementAtEvent(evt);

      if (activePoints.length > 0) {
        //get the internal index of slice in pie chart`
        var clickedElementindex = activePoints[0]["_index"];

        //get specific label by index 
        var label = that.myChart.data.labels[clickedElementindex];

        //get value by index      
        var value = that.myChart.data.datasets[0].data[clickedElementindex];

        console.log(clickedElementindex);
        fu(that.stepArr[clickedElementindex]);

        /* other stuff that requires slice's label and value */
      }
    }
  }

  /**
   * A method wich adds event listener on onmouseclick over data dots on chart.
   * As soon mouse is over dot callback 'fu' is called.
   * @param {function} callback function to call on event 
   * @return none
   */
  addEventListenerOnMouseClick(fu) {
    var that = this;
    this.mountPointChart.onclick = function (evt) {
      var activePoints = that.myChart.getElementAtEvent(evt);

      if (activePoints.length > 0) {
        //get the internal index of slice in pie chart`
        var clickedElementindex = activePoints[0]["_index"];

        //get specific label by index 
        var label = that.myChart.data.labels[clickedElementindex];

        //get value by index      
        var value = that.myChart.data.datasets[0].data[clickedElementindex];

        console.log(clickedElementindex);
        fu(that.stepArr[clickedElementindex]);

        /* other stuff that requires slice's label and value */
      }
    }
  }
}







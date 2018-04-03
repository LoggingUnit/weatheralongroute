'use strict';
/**
 * A class which providing all weather API functions.
 * One of the oldest part of code with appropriate quality. I am sorry.
 * Nov 2017
 */
class Weather {

  /**
   * Constructor creates new Weather obj
   * @param {string} endpointAddress address of weather API
   * @return {Object} instance of Weather class
   */
  constructor(endpointAddress) {
    this.endpointAddress = endpointAddress;
  }

  /**
   * A method to apply propper forecast to each step from simple step array
   * @param {Object} routeSimple route with simplified step with fixed intervals 
   * @param {Object[]} weatherForecast forecast array with all forecasts for current step
   * @return {Object[]} routeWithWeather array of routeSimple with applied forcasts
   */
  assignWeatherToRoute(routeSimple, weatherForecast) {
    // console.log('routeSimple: ', routeSimple);
    // console.log('weatherForecast: ', weatherForecast);

    var routeWithWeather = [];

    for (var i = 0 ; i <= routeSimple.length-1; i++) {
      routeWithWeather[i] = calcWeatherForSingleStep(routeSimple[i], weatherForecast[i])
    }

    function calcWeatherForSingleStep(singleStep, singleWeather) {
      //console.log(singleStep,singleWeather);
      
      var idOfMinimal = 0;
      var diffMinimal = Infinity;

      for (let j = 0; j < singleWeather.list.length; j++) {
        var diff = Math.abs((singleStep.timeEnd/1000).toFixed(0)-singleWeather.list[j].dt);
        //console.log(diff);
        if (diff <= diffMinimal) {
          diffMinimal = diff;
          idOfMinimal = j;
          //console.log('new minimal diff: ', diff);
        }
        if (diff > diffMinimal) {
          //console.log('next more than previous: ', diff, diffMinimal);
          break;
        }
      }
      
      singleStep.city = singleWeather.city;
      singleStep.weather = singleWeather.list[idOfMinimal];
      return singleStep;
    }
    
    return routeWithWeather;
  }

  /**
   * Method to recieve a weather forecast for each point of input array
   * @param {Object[]} arr - input array of steps 
   * @return {Promise}
   */
  weatherForecast(arr) {
    var that = this;
    return new Promise(function(resolve,reject) {
      var promises = [];
      for (var i = 0; i < arr.length; i++) {
        promises[i] = that._singleWeatherXhrPromise(arr[i]);
      }
      Promise.all(promises)
        .then(results => {
          resolve(results);
        });
    });
  }

  /**
   * Method to create a single XMLHttpRequest promise
   * @param {Object} input cobject contains coordinate of point to know weather in (single step element)
   * @return {Promise}
   */
  _singleWeatherXhrPromise(input) {
    let lat = input.coordStepEnd.lat().toFixed(6);
    let lng = input.coordStepEnd.lng().toFixed(6);
    var url = `${this.endpointAddress}&lat=${lat}&lon=${lng}`;
    //alert(url);
    
    return new Promise(function(resolve, reject) {

      var xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
  
      xhr.onload = function() {
        if (this.status == 200) {
          var json = JSON.parse(this.response)
          resolve(json);
        } else {
          var error = new Error(this.statusText);
          error.code = this.status;
          reject(error);
        }
      };
  
      xhr.onerror = function() {
        reject(new Error("Network Error"));
      };
  
      xhr.send();
    });
  }
}
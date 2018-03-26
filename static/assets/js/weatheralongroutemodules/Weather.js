'use strict';
/**
 * A class which providing all weather API functions.
 */
class Weather {

  constructor(endpointAddress) {
    this.endpointAddress = endpointAddress;
  }

  /**
   * A method to apply propper forecast to each step from simple step array
   * routeSimple - route with simplified step with fixed intervals 
   * weatherForecast - forecast array with all forecasts for current step
   * @param {routeSimple, weatherForecast}
   * @return {routeWithWeather}
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
   * arr - input array of steps 
   * @param {arr}
   * @return {promise}
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
   * arr[] - one step element from simple route array to add lat and lng into URL
   * @param {arr[]}
   * @return {promise}
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
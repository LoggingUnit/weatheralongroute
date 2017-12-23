'use strict';
/**
 * A class which providing all weather API functions.
 */
class Weather {

  constructor(endpointAddress) {
    this.endpointAddress = endpointAddress;
  }

  /**
   * Method to recieve a weather forecast for each point of input array
   * arr - input array of steps 
   * @param {arr}
   * @return nope
   */
  weatherForecast(arr) {
    
    var promises = [];
    for (var i = 0; i < arr.length; i++) {
      promises[i] = this._singleWeatherXhrPromise(arr[i]);
    }
    Promise.all(promises)
      .then(results => {
        console.log(results);
        return results;
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
    alert(url);
    
    return new Promise(function(resolve, reject) {

      var xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
  
      xhr.onload = function() {
        if (this.status == 200) {
          resolve(this.response);
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
'use strict';

function initMap() {
  var weather = new Weather('https://api.openweathermap.org/data/2.5/forecast?mode=json&units=metric&APPID=0bc7c6edc6e5bc381e503d32151b71c9');

  var googleMaps = new GoogleMaps("map", "right-panel");
  googleMaps.initializeMap(-24.345, 134.46, 4);

  let promise = new Promise(function (res, rej) {
    googleMaps.calcRoute('Oktyabrsky', 'Piter', 1000000, res, rej);
  });
  promise.then(
    response => {
      googleMaps.setOffset(0);
      return weather.weatherForecast(googleMaps.getRoute());
    }
  )
  .then(
    response => {
      weather.assignWeatherToRoute(googleMaps.getRoute(), response);
    ;}
  )
}


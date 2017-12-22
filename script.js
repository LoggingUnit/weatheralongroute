'use strict';

function initMap() {
  var googleMaps = new GoogleMaps("map", "right-panel");
  googleMaps.initializeMap(-24.345, 134.46, 4);

  let promise = new Promise(function (res, rej) {
    googleMaps.calcRoute('Oktyabrsky', 'Piter', 100000, res, rej);
  });
  promise.then(
    result => { getHuet() },
    error => { console.log; }
  );

  function getHuet() {
    var someShit = googleMaps.getRoute();
    console.log(someShit);

    // var xhr = new XMLHttpRequest();

    // var uri = 'https://api.openweathermap.org/data/2.5/forecast?lat=46&lon=75&mode=json&units=metric&APPID=0bc7c6edc6e5bc381e503d32151b71c9';
    // xhr.open('GET', uri);
    // xhr.send();

    // xhr.onreadystatechange = function () {
    //   if (xhr.readyState != 4) return;

    //   if (xhr.status != 200) {
    //     console.log(xhr.status + ': ' + xhr.statusText);
    //   } else {
    //     console.log(xhr.responseText);
    //   }

    // }
  }

}


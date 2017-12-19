'use strict';

function initMap() {
  var googleMaps = new GoogleMaps("map", "right-panel");
  googleMaps.initializeMap(-24.345, 134.46, 4);
  googleMaps.calcRoute('Vladivostok', 'Paris', 5000);
  // 49282.4 - ok
  // 49282.39 - not ok
  function getHuet() {
    var someShit = googleMaps.getRoute();
  }
  setTimeout(getHuet, 3000);
}
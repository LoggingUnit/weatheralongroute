'use strict';

function initMap() {
  var googleMaps = new GoogleMaps("map", "right-panel");
  googleMaps.initializeMap(-24.345, 134.46, 4);
  googleMaps.calcRoute('Oktyabrsky', 'Ufa', 10000, 1000);
  function getHuet() {
    var someShit = googleMaps.getRoute();
  }
  setTimeout(getHuet, 3000);
}
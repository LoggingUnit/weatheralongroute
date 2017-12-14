'use strict';

function initMap() {
  var googleMaps = new GoogleMaps("map", "right-panel");
  googleMaps.initializeMap(-24.345, 134.46, 4);
  googleMaps.calcRoute('Oktyabrsky', 'Ufa', 15, 1);
  function getHuet() {
    var someShit = googleMaps.getRoute();
  }
  setTimeout(getHuet, 3000);
}
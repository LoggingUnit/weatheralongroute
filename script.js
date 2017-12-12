'use strict';

function initMap() {
  var googleMaps = new GoogleMaps("map", "right-panel");
  googleMaps.initializeMap(-24.345, 134.46, 4);
  googleMaps.calcRoute('Ufa', 'Piter');
}
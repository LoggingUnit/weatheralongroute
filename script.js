'use strict';

function initMap() {
  var googleMaps = new GoogleMaps("map", "right-panel");
  googleMaps.initializeMap(-24.345, 134.46, 4);
  googleMaps.calcRoute('Oktyabrsky', 'Piter', 50000);

  function getHuet() {
    var someShit = googleMaps.getRoute();
    console.log(someShit);
  }
  setTimeout(getHuet, 3000);
}
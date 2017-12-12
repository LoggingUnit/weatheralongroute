'use strict';

function initMap() {
  var googleMaps = new GoogleMaps("map", "right-panel");
  googleMaps.initializeMap(-24.345, 134.46, 4);
  googleMaps.calcRoute('Ufa', 'Piter');
  function getHuet() {
    var someShit = googleMaps.getRoute();
    for (var i = 0; i < someShit.length; i++) {
      console.log(someShit[i].lat(), someShit[i].lng());
    };
    
  }
  setTimeout(getHuet, 3000);
}
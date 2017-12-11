'use strict';
/**
 * A class which providing all google maps API functions.
 */
class GoogleMaps {

  constructor() {
    // constructor body is here
  }

  /**
   * Method to initialize a map and info panel
   * @param {div, div} div for mount map and info panel with the route
   * @return nope
   */
  initializeMap(mountPointMap, mountPointPanel) {
    var that = this;
    var map = new google.maps.Map(document.getElementById(mountPointMap), {
      zoom: 4,
      center: { lat: -24.345, lng: 134.46 }  // Australia.
    });
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer({
      draggable: true,
      map: map,
      panel: document.getElementById(mountPointPanel)
    });
    directionsDisplay.addListener('directions_changed', function () {
      that.computeTotalDistance(directionsDisplay.getDirections());
    });
    that.displayRoute('Perth, WA', 'Sydney, NSW', directionsService,
      directionsDisplay);
  }

  /**
   * Method to show a route and info panel in defined divs
   * @param {origin, destination, service, display}
   * @return nope
   */
  displayRoute(origin, destination, service, display) {
    service.route({
      origin: origin,
      destination: destination,
      //waypoints: [{location: 'Adelaide, SA'}, {location: 'Broken Hill, NSW'}],
      travelMode: 'DRIVING',
      avoidTolls: true
    }, function (response, status) {
      if (status === 'OK') {
        display.setDirections(response);
      } else {
        alert('Could not display directions due to: ' + status);
      }
    });
  }

  /**
    * Method to compute a distance and change value in defined divs
    * @param {result}
    * @return nope
    */
  computeTotalDistance(result) {
    var total = 0;
    var myroute = result.routes[0];
    for (var i = 0; i < myroute.legs.length; i++) {
      total += myroute.legs[i].distance.value;
    }
    total = total / 1000;
    document.getElementById('total').innerHTML = total + ' km';
  }
}

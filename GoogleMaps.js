'use strict';
/**
 * A class which providing all google maps API functions.
 */
class GoogleMaps {

  constructor(mountPointMap, mountPointPanel) {
    this.mountPointMap = mountPointMap;
    this.mountPointPanel = mountPointPanel;
    this.directions;
    this.map;
  }

  /**
   * Method to initialize a map and info panel
   * @param {div, div} div for mount map and info panel with the route
   * @return nope
   */
  initializeMap(lat, lng, zoom) {
    this.map = new google.maps.Map(document.getElementById(this.mountPointMap), {
      zoom: zoom,
      center: { lat, lng }
    });
  }

  /**
   * Method to view a map and info panel
   * @param {div, div} div for mount map and info panel with the route
   * @return nope
   */
  viewRoute() {
    var that = this;
    var directionsDisplay = new google.maps.DirectionsRenderer({
      draggable: true,
      map: this.map,
      panel: document.getElementById(this.mountPointPanel)
    });
    directionsDisplay.setDirections(this.directions);
    directionsDisplay.addListener('directions_changed', function () {
      that.directions = directionsDisplay.getDirections();
      that.computeTotalDistance();
    });
  }

  /**
   * Method to show a route and info panel in defined divs
   * @param {origin, destination, service, display}
   * @return nope
   */
  calcRoute(origin, destination) {
    var that = this;
    var directionsService = new google.maps.DirectionsService;
    directionsService.route({
      origin: origin,
      destination: destination,
      //waypoints: [{location: 'Adelaide, SA'}, {location: 'Broken Hill, NSW'}],
      travelMode: 'DRIVING',
      avoidTolls: true
    }, function (response, status) {
      if (status === 'OK') {
        that.directions = response;
        that.viewRoute();
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
  computeTotalDistance() {
    var total = 0;
    var myroute = this.directions.routes[0];
    for (var i = 0; i < myroute.legs.length; i++) {
      total += myroute.legs[i].distance.value;
    }
    total = total / 1000;
    document.getElementById('total').innerHTML = total + ' km';
  }

  getRoute() {
    console.log("dots count ", this.directions.routes[0].overview_path.length);
    return this.directions.routes[0].overview_path;
  }
}

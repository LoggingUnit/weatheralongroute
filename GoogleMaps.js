'use strict';
/**
 * A class which providing all google maps API functions.
 */
class GoogleMaps {

  constructor(mountPointMap, mountPointPanel) {
    this.mountPointMap = mountPointMap;
    this.mountPointPanel = mountPointPanel;
    this.directions;
    this.directionsFixedStep;
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
   * Method to show a route and info panel in defined divs. Origin - start point of the route. Dest. - 
   * final point of the route. Step and toler. - variable for internal _simplifyRoute(step, tolerance) method,
   *  see details there.
   * @param {origin, destination, step, tolerance}
   * @return nope
   */                                                                 
  calcRoute(origin, destination, step, tolerance) {
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
        that._viewRoute();
        that._simplifyRoute(step, tolerance);
        that._viewMarkers(that.directions.routes[0].overview_path);
      } else {
        alert('Could not display directions due to: ' + status);
      }
    });
  }

  /**
   * Method returns simplified route with fixed coordinate step entered previously into
   * _simplifyRoute(step) method arg step.
   * Output prepared to use with weather service.
   * @param {none}
   * @return {lat, lng, time}
   */
  getRoute() {
    console.log("dots count ", this.directions.routes[0].overview_path.length);
    console.log(this.directions);
    return this.directions.routes[0].overview_path;
  }

  /**
   * Method to compute a distance and change value in defined divs
   * @param {result}
   * @return nope
   */
  _computeTotalDistance() {
    var total = 0;
    var myroute = this.directions.routes[0];
    for (var i = 0; i < myroute.legs.length; i++) {
      total += myroute.legs[i].distance.value;
    }
    total = total / 1000;
    document.getElementById('total').innerHTML = total + ' km';
  }

  /**
   * Method to simplify a direction route with fixed step and defined tolerance. Both vars have to be entered in kilometers.
   * Step - how many kilometers between route coordinate points in simplified route. Tolerance - if we already have a route point
   * (in original not simplified route) within tolerance from new calculated route point, original point will be used, simplified 
   * point will not be created
   * @param {step, tolerance} 
   */
  _simplifyRoute(step, tolerance) {
    console.log(step, tolerance);

  }

  /**
   * Method to show custom markers of route on the map. When method received array of LatLng obj it creates and displays markers;
   * @param {markersArray} 
   */
  _viewMarkers(markersArray) {
    var that = this;
    function createMarker (lat, lng) {
      var myLatLng = {lat, lng};
      var marker = new google.maps.Marker({
        position: myLatLng,
        map: that.map,
        title: 'Lek kek!'
      })
    }

    if (typeof markersArray[0].lat === 'function') {
      for (var i = 0; i < markersArray.length; i++) {
        createMarker(markersArray[i].lat(), markersArray[i].lng());
      };
    }
  }

  /**
   * Method to view a map and info panel
   * @param {div, div} div for mount map and info panel with the route
   * @return nope
   */
  _viewRoute() {
    var that = this;
    var directionsDisplay = new google.maps.DirectionsRenderer({
      draggable: true,
      map: this.map,
      panel: document.getElementById(this.mountPointPanel)
    });
    directionsDisplay.setDirections(this.directions);
    directionsDisplay.addListener('directions_changed', function () {
      that.directions = directionsDisplay.getDirections();
      that._computeTotalDistance();
    });
  }
}

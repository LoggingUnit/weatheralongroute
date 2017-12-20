'use strict';
/**
 * A class which providing all google maps API functions.
 */
class GoogleMaps {

  constructor(mountPointMap, mountPointPanel) {
    this.mountPointMap = mountPointMap;
    this.mountPointPanel = mountPointPanel;
    this.directions;
    this.routeSimple;
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
   * final point of the route. Step - variable for internal _simplifyRoute(step) method,
   *  see details there.
   * @param {origin, destination, step}
   * @return nope
   */
  calcRoute(origin, destination, step) {
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
        that._simplifyRoute(step);
        //that._viewMarkers(that.directions.routes[0].overview_path);
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
    console.log("dots count original", this.directions.routes[0].overview_path.length);
    //console.log("dots count simple", this.routeSimple.length);
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
   * Method to simplify a direction route with fixed step.
   * Step - how many meters between route coordinate points in simplified route.
   * @param {step} 
   */
  _simplifyRoute(step) {

    var that = this;

    var simpleRoute = new SimpleRoute(this.directions, step);
    var arrRoute = simpleRoute.simplifyRoute();
    

    //  /////////////////////////////////////// FOR TEST PURPOSES ONLY
    let i = 1;
    while (arrRoute[i]) {

      var lat = arrRoute[i].coordStepEnd.lat();
      var lng = arrRoute[i].coordStepEnd.lng();
      var title = arrRoute[i].stepId.toString();

      var myLatLng = {lat, lng};
      var marker = new google.maps.Marker({
        position: myLatLng,
        map: that.map,
        title: title
      })


      i++;
    }
// ////////////////////////////////////////////////////////////////////////
  }

  /**
   * Method to show custom markers of route on the map. When method received array of LatLng obj it creates and displays markers;
   * @param {markersArray} 
   */
  _viewMarkers(markersArray, label) {
    var title = label || 'Point'
    var that = this;
    function createMarker(lat, lng) {
      var myLatLng = { lat, lng };
      var marker = new google.maps.Marker({
        position: myLatLng,
        map: that.map,
        title: title
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

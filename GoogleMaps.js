'use strict';
/**
 * A class which providing all google maps API functions.
 */
class GoogleMaps {

  constructor(mountPointMap) {
    this.mountPointMap = mountPointMap;
    this.directions;
    this.directionsDisplay;
    this.routeSimple;
    this.definedStep;
    this.markers = [];
    this.map;
  }

  /**
   * Method allows to add listener of directions_changed event of directionsDisplay object
   * fu - callback function
   * @param {*} fu 
   */
  addListenerOnDirChange(fu) {
    var that = this;
    this.directionsDisplay.addListener('directions_changed', function () {
      that.directions = that.directionsDisplay.getDirections();
      that._simplifyRoute(that._getDefinedStep());
      that._viewMarkers();
      that._computeTotalDistance();
      if (fu) {
        fu();
      }
    });
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

    this.directionsDisplay = new google.maps.DirectionsRenderer({
      draggable: true,
      map: this.map,
    });
  }

  /**
   * Method to show a route and info panel in defined divs. 
   * Origin - start point of the route. City name.
   * Dest - final point of the route.
   * Step - variable for internal _simplifyRoute(step) method, *  see details there.
   * res, rej - promises response
   * @param {origin, destination, step}
   * @return nope
   */
  calcRoute(origin, destination, step) {
    this.definedStep = step;
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
        that.addListenerOnDirChange(); 
        that._simplifyRoute(step);
        that._viewMarkers();
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
    // console.log("dots count original: ", this.directions.routes[0].overview_path.length);
    // console.log("dots count simple: ", this.routeSimple.length);
    //console.log(this.routeSimple);
    return this.routeSimple;
  }

  /**
   * Method corrects timeStart and timeEnd for each step according to fixed offset value
   * to give to a use ability to change time of route start
   * offset - offset value in hours
   * @param {offset}
   * @return none
   */
  setOffset(offset) {
    console.log(offset);
    var offsetMilliSec = offset * 3600 * 1000;
    for (var i = 1; i < this.routeSimple.length; i++) {
      // console.log(this.routeSimple[i].timeStart);
      this.routeSimple[i].timeStart += offsetMilliSec;
      // console.log(this.routeSimple[i].timeStart);
      this.routeSimple[i].timeEnd += offsetMilliSec;
    }
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
   * Method to return defined step
   * @return {}
   */
  _getDefinedStep() {
    return this.definedStep;
  }

  /**
   * Method to simplify a direction route with fixed step.
   * Step - how many meters between route coordinate points in simplified route.
   * @param {step} 
   */
  _simplifyRoute(step) {
    var simpleRoute = new SimpleRoute(this.directions, step);
    this.routeSimple = simpleRoute.simplifyRoute();
  }

  /**
   * Method to show custom markers of route on the map. 
   * When method received array of LatLng obj it creates and displays markers;
   * @param {none} 
   */
  _viewMarkers() {
    var that = this;
    var arrRoute = this.routeSimple;
    let i = 0;

    //Delete all markers
    if (that.markers) {
      while (that.markers[i]) {
        that.markers[i].setMap(null);
        i++;
      }
      that.markers = [];
      i = 1;
    }

    //Create the markers from routeSimple array
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

      that.markers.push(marker);

      i++;
    }
  }

  /**
   * Method to view a map and info panel
   * @param {div, div} div for mount map and info panel with the route
   * @return nope
   */
  _viewRoute() {
    var that = this;

    this.directionsDisplay.setMap(null);
    this.directionsDisplay.setMap(this.map);
    this.directionsDisplay.setDirections(this.directions);
    
  }
}

'use strict';
/**
 * A class which providing all google maps API functions.
 * One of the oldest part of code with appropriate quality. I am sorry.
 * Nov 2017
 */
class GoogleMaps {

  /**
   * Constructor creates new GoogleMaps obj and view it on element with #mountPointMap
   * @param {string} mountPointMap id of <div> element to mount map
   * @return {Object} instance of GoogleMaps class
   */
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
   * @param {function} fu callback function
   */
  addListenerOnDirChange(fu) {
    var that = this;
    this.directionsDisplay.addListener('directions_changed', function () {
      that.directions = that.directionsDisplay.getDirections();
      that._simplifyRoute(that._getDefinedStep());
      that._computeTotalDistance();
      if (fu) {
        fu();
      }
    });
  }

  /**
   * Method to initialize map
   * @param {Object} lat lat coordinate of map center
   * @param {Object} lng lng coordinate of map center
   * @param {number} zoom numeric value of zoom
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
   * Method creates instance of google API DirectionsService class and runs appropriate methods to 
   * work with returned route
   * tripRequestObj conbsist of followin data: 
   * Origin - start point of the route. City name.
   * Dest - final point of the route.
   * Step - variable for internal _simplifyRoute(step) method, * see details there.
   * @param {object} tripRequestObj
   * @return nope
   */
  calcRoute(tripRequestObj) {
    console.log(tripRequestObj);
    this.definedStep = tripRequestObj.step;
    var that = this;
    var directionsService = new google.maps.DirectionsService;
    directionsService.route({
      origin: tripRequestObj.origin,
      destination: tripRequestObj.destination,
      //waypoints: [{location: 'Adelaide, SA'}, {location: 'Broken Hill, NSW'}],
      travelMode: 'DRIVING',
      avoidTolls: true
    }, function (response, status) {
      if (status === 'OK') {
        that.directions = response;
        that._viewRoute();
        that.addListenerOnDirChange();
        that._simplifyRoute(tripRequestObj.step, moment(tripRequestObj.timeTripBegin).unix());
        } else {
        alert('Could not display directions due to: ' + status);
      }
    });
  }

  /**
   * Method to center map on coordinates from params
   * @param {Object} point coordinate to center at
   * @return nope
   */
  centerAt(point) {
    console.log(point.coordStepEnd);
    console.log(this);
    this.map.panTo(point.coordStepEnd);
    this.map.setZoom(10);
  }

  /**
   * Method returns simplified route with fixed step entered previously into
   * _simplifyRoute(step) method arg step.
   * Output prepared to use with weather service.
   * @param {none}
   * @return {Object} routeSimple simplified route with fixed step
   */
  getRoute() {
    // console.log("dots count original: ", this.directions.routes[0].overview_path.length);
    // console.log("dots count simple: ", this.routeSimple.length);
    return this.routeSimple;
  }

  /**
   * Method to compute a distance and change value in defined divs
   * @param {}
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
   * @return {number} step distance used to simplify route
   */
  _getDefinedStep() {
    return this.definedStep;
  }

  /**
   * Method to simplify a direction route with fixed step.
   * @param {number} step - how many meters between route coordinate points in simplified route.
   * @param {number} timeTripBeginUnix - time in unix format wich relates to trip begin
   */
  _simplifyRoute(step, timeTripBeginUnix) {
    var simpleRoute = new SimpleRoute(this.directions, step, timeTripBeginUnix);
    this.routeSimple = simpleRoute.simplifyRoute();
  }

  /**
   * Method to show custom markers of route on the map. 
   * @param {none} 
   */
  drawMarkers() {
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

      var myLatLng = { lat, lng };
      var marker = new google.maps.Marker({
        position: myLatLng,
        map: that.map,
        title: title,
        icon: `images/weather-icons/${arrRoute[i].weather.weather[0].icon}.png`
      })

      that.markers.push(marker);

      i++;
    }

    //with part of code related to markert clusterization, don`t implemented yet 
    var styles = [[{
      url: 'weather-icons/01d.png',
      height: 35,
      width: 35,
      anchor: [16, 0],
      textColor: '#ff00ff',
      textSize: 10
    }, {
      url: 'weather-icons/01d.png',
      height: 45,
      width: 45,
      anchor: [24, 0],
      textColor: '#ff0000',
      textSize: 11
    }, {
      url: 'weather-icons/01d.png',
      height: 55,
      width: 55,
      anchor: [32, 0],
      textColor: '#ffffff',
      textSize: 12
    }]];
  }

  /**
   * Method to view a map and info panel
   * @param {} 
   * @return nope
   */
  _viewRoute() {
    var that = this;

    this.directionsDisplay.setMap(null);
    this.directionsDisplay.setMap(this.map);
    this.directionsDisplay.setDirections(this.directions);

  }
}

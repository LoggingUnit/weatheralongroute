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
  calcRoute(origin, destination, step, timeTripBegin) {
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
        that._simplifyRoute(step, moment(timeTripBegin).unix());
        } else {
        alert('Could not display directions due to: ' + status);
      }
    });
  }

  centerAt(point) {
    console.log(point.coordStepEnd);
    console.log(this);
    this.map.panTo(point.coordStepEnd);
    this.map.setZoom(10);
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
    return this.routeSimple;
  }

  /**
   * Method corrects timeStart and timeEnd for each step according to inputed timeTripBegin value
   * to give to a use ability to change time of route start
   * timeTripBegin - timeTripBegin 
   * @param {offset}
   * @return none
   */
  _setTimeTripBegin(timeTripBegin) {
    var date = new Date(); 
    console.log('GoogleMaps class timeTripBegin: ',timeTripBegin);
    console.log('GoogleMaps class timeTripBegin UNIX: ', moment(timeTripBegin).unix());
    console.log('Date.now()/1000', date.getTime()/1000);
    console.log('diff ', moment(timeTripBegin).unix()-date.getTime()/1000);
    // var offsetMilliSec = offset * 3600 * 1000;
    // for (var i = 1; i < this.routeSimple.length; i++) {
    //   // console.log(this.routeSimple[i].timeStart);
    //   this.routeSimple[i].timeStart += offsetMilliSec;
    //   // console.log(this.routeSimple[i].timeStart);
    //   this.routeSimple[i].timeEnd += offsetMilliSec;
    // }
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
  _simplifyRoute(step, timeTripBeginUnix) {
    var simpleRoute = new SimpleRoute(this.directions, step, timeTripBeginUnix);
    this.routeSimple = simpleRoute.simplifyRoute();
  }

  /**
   * Method to show custom markers of route on the map. 
   * When method received array of LatLng obj it creates and displays markers;
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
    // var markerCluster = new MarkerClusterer(this.map, this.markers, {
    //   maxZoom: null,
    //   gridSize: null,
    //   styles: styles[0],
    // });
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

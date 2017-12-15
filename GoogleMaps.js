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
    console.log("dots count simple", this.routeSimple.length);
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
    var that = this;
    this.routeSimple = [];
    var simple = this.routeSimple;
    var original = this.directions.routes[0].overview_path;
    var libSpher = google.maps.geometry.spherical;
    simple = this.routeSimple;
    var currentPoint = 0;
    var arr = [];

    //Get distance of original route in meters and count steps to use their number as array length
    var simpleArrayLength = Math.ceil(this.directions.routes[0].legs[0].distance.value / step);
    simple[0] = original[0];
    arr[0] = {point: simple[0],
              distance: 0};
    
    for (var i = 1; i < simpleArrayLength; i++) {
      var obj = calcPoint();
      simple[i] = obj.point;
      arr[i] = obj;
    };

    for (var m = 0; m <= arr.length-1; m++) {
      console.log('obj: ', m, ' distance: ', arr[m].distance);
    }

    this._viewMarkers(simple);

    function calcPoint() {
      let distance = 0;
      let distancePrev = 0;

      while ((distance <= step)&&(currentPoint < that.directions.routes[0].overview_path.length-1)) {
        distancePrev = distance;
        distance += libSpher.computeDistanceBetween(original[currentPoint],original[currentPoint+1]);
        currentPoint++;
      }

      if (distance > step + tolerance) {
        var diff = distance - step;
        var heading = libSpher.computeHeading(original[currentPoint-1],original[currentPoint]);
        var newPoint = libSpher.computeOffset(original[currentPoint-1], (distance-distancePrev-diff), heading);
        var distanceNew = libSpher.computeDistanceBetween(original[currentPoint-1], newPoint);
        console.log('last point of step: ', currentPoint-1, ', distance: ', distance);
        console.log('diff: ', diff);
        console.log('new point distance: ', distanceNew);
        console.log('######################################');
        return {point: newPoint,
                distance: distancePrev + distanceNew}
      }      
      console.log('last point of step: ', currentPoint, ', distance: ', distance);
      console.log('######################################');
      return {point: original[currentPoint],
              distance: distance};
    }
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

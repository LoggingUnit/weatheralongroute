'use strict';

var buttonSubmit = document.getElementById('buttonSubmit');
buttonSubmit.addEventListener('click', callbackButtonSubmit);
var buttonRegister = document.getElementsByClassName("header__register")[0];
buttonRegister.addEventListener('click', callbackButtonRegister);
var buttonLogin = document.getElementsByClassName("header__login")[0];
buttonLogin.addEventListener('click', callbackButtonLogin);

var inputFrom = document.getElementById('inputFrom');
var inputTo = document.getElementById('inputTo');
var inputTimeTripBegin = document.getElementsByClassName("modal__form_time")[0];
var inputStep = document.getElementById('inputStep');


let promiseServicesLoaded = new Promise(function (resolve, reject) {
  var googleapiScript = document.getElementById('googleapisScript');
  googleapiScript.onload = function () {
    resolve('googleapisScripts loaded succesfully');
  }
  googleapiScript.onerror = function () {
    reject(new Error('googleapisScripts is unable to load'));
  }
});

$(document).ready(function() {
  window.myPopUpManager = new PopUpManager('modal','modal__form_route','modal__form_register','modal__form_login');
  window.myCalendar = new MyCalendar('#calendar', myPopUpManager.popUpShow, myPopUpManager.setTime);
});

promiseServicesLoaded
  .then(
  result => {
    console.log('Done: ', result);
    window.weather = new Weather('https://api.openweathermap.org/data/2.5/forecast?mode=json&units=metric&APPID=0bc7c6edc6e5bc381e503d32151b71c9&lang=ru');
    window.googleMaps = new GoogleMaps("map");

    window.charts = new Charts('chart-canvas');
    
    googleMaps.initializeMap(66.788890, 93.775280, 3);
    googleMaps.addListenerOnDirChange(refreshWeatherOnDirChange);
    buttonSubmit.disabled = false;
  },
  error => console.log('Error: ', error.message)
  );

function callbackButtonSubmit() {
  if (validate(inputFrom) && validate(inputTo) && validate(inputStep)) {
    console.log('form validated');
    googleMaps.calcRoute(inputFrom.value, inputTo.value, inputStep.value * 1000, inputTimeTripBegin.innerHTML);
    document.getElementById('map').scrollIntoView();
    window.myPopUpManager.popUpHide('modal__form_route');
  }
}

function callbackButtonRegister() {
  console.log('script.js callbackButtonRegister activated');
  window.myPopUpManager.popUpShow('modal__form_register');
}

function callbackButtonLogin() {
  console.log('script.js callbackButtonLogin activated');
  window.myPopUpManager.popUpShow('modal__form_login');
}

function refreshWeatherOnDirChange() {
  let prom = weather.weatherForecast(googleMaps.getRoute());
  prom.then(
    response => {
      let stepWithWeatherAssigned = weather.assignWeatherToRoute(googleMaps.getRoute(), response);
      googleMaps.drawMarkers();
      console.log('stepWithWeatherAssigned: ', stepWithWeatherAssigned);

      charts.plotData(stepWithWeatherAssigned, 'temperature', 'precipitation');
      charts.addEventListenerOnMouseClick(googleMaps.centerAt.bind(googleMaps)); 
    });
}

  









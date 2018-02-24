'use strict';

var buttonSubmit = document.getElementById('buttonSubmit');
buttonSubmit.addEventListener('click', callbackButtonSubmit);
var buttonRegister = document.getElementsByClassName("header__register")[0];
buttonRegister.addEventListener('click', callbackButtonRegister);
var buttonLogin = document.getElementsByClassName("header__login")[0];
buttonLogin.addEventListener('click', callbackButtonLogin);
var buttonSubmitRegistration = document.getElementById('buttonSubmitRegistration');
buttonSubmitRegistration.addEventListener('click', callbackButtonSubmitRegistration);
var buttonSubmitLogin = document.getElementById('buttonSubmitLogin');
buttonSubmitLogin.addEventListener('click', callbackButtonSubmitLogin);

var inputFrom = document.getElementById('inputFrom');
var inputTo = document.getElementById('inputTo');
var inputTimeTripBegin = document.getElementsByClassName("modal__form_time")[0];
var inputStep = document.getElementById('inputStep');

var inputEmailRegister = document.getElementById('inputEmailRegister');
var inputPasswordRegister = document.getElementById('inputPasswordRegister');
var inputUsernameRegister = document.getElementById('inputUsernameRegister');

var inputPasswordLogin = document.getElementById('inputPasswordLogin');
var inputUsernameLogin = document.getElementById('inputUsernameLogin');

let promiseGoServicesLoaded = new Promise(function (resolve, reject) {
  var googleapiScript = document.getElementById('googleapisScript');
  googleapiScript.onload = function () {
    resolve('googleapisScripts loaded succesfully');
  }
  googleapiScript.onerror = function () {
    reject(new Error('googleapisScripts is unable to load'));
  }
});

var myStorage = new MyStorage('local');
var userAccount = new UserAccount(myStorage.getItem, myStorage.setItem);
myStorage.getItem('lastUserName')
  .then(
    result => {
      console.log(`MyStorage.js last user found: ${result}`);
      userAccount.getAccDataByUsername(result)
    },
    error => { console.log(error) }
  );

promiseGoServicesLoaded
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

$(document).ready(function () {
  window.myPopUpManager = new PopUpManager('modal', 'modal__form_route', 'modal__form_register', 'modal__form_login');
  window.myCalendar = new MyCalendar('#calendar', myPopUpManager.popUpShow, myPopUpManager.setTime);
});

function callbackButtonSubmit() {
  console.log('script.js callbackButtonSubmit activated');
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
  //add validation of input data here
  if ('if valid check with validator to be here') {
    buttonSubmitRegistration.disabled = false;
  }
}

function callbackButtonSubmitRegistration() {
  console.log('script.js callbackButtonSubmitRegistration activated');

  var userObj = {
    userName: inputUsernameRegister.value,
    userEmail: inputEmailRegister.value,
    userPassword: inputPasswordRegister.value
  };
  userAccount.createUser(userObj);
  window.myPopUpManager.popUpHide('modal__form_register');
}

function callbackButtonLogin() {
  console.log('script.js callbackButtonLogin activated');
  window.myPopUpManager.popUpShow('modal__form_login');
  //add validation of input data here
  if ('if valid check with validator to be here') {
    buttonSubmitLogin.disabled = false;
  }
}

function callbackButtonSubmitLogin() {
  console.log('script.js callbackButtonSubmitLogin activated');
  var userObj = {
    userName: inputUsernameLogin.value,
    userEmail: null,
    userPassword: inputPasswordLogin.value
  };
  userAccount.loginUser(userObj);
  window.myPopUpManager.popUpHide('modal__form_login');
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











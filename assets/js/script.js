'use strict';

var buttonSubmit = document.getElementById('buttonSubmit');
var buttonRegister = document.getElementsByClassName("header__register")[0];
var buttonLogin = document.getElementsByClassName("header__login")[0];
var buttonLogout = document.getElementsByClassName("header__logout")[0];
var buttonProfile = document.getElementsByClassName("header__profile")[0];
var buttonSubmitRegistration = document.getElementById('buttonSubmitRegistration');
var buttonSubmitLogin = document.getElementById('buttonSubmitLogin');
var buttonTripAdd = document.getElementsByClassName("trip-route__add-trip")[0];

buttonSubmit.addEventListener('click', callbackButtonSubmit);
buttonRegister.addEventListener('click', callbackButtonRegister);
buttonLogin.addEventListener('click', callbackButtonLogin);
buttonLogout.addEventListener('click', callbackButtonLogout);
buttonProfile.addEventListener('click', callbackButtonProfile)
buttonSubmitRegistration.addEventListener('click', callbackButtonSubmitRegistration);
buttonSubmitLogin.addEventListener('click', callbackButtonSubmitLogin);
buttonTripAdd.addEventListener('click', callbackButtonTripAdd);

var inputFrom = document.getElementById('inputFrom');
var inputTo = document.getElementById('inputTo');
var inputTimeTripBegin = document.getElementsByClassName("modal__form_time")[0];
var inputStep = document.getElementById('inputStep');

var inputEmailRegister = document.getElementById('inputEmailRegister');
var inputPasswordRegister = document.getElementById('inputPasswordRegister');
var inputUsernameRegister = document.getElementById('inputUsernameRegister');

var inputPasswordLogin = document.getElementById('inputPasswordLogin');
var inputUsernameLogin = document.getElementById('inputUsernameLogin');

document.getElementById('googleapisScript').onload = function () {
  console.log('googleapisScripts loaded succesfully');
  window.myPopUpManager = new PopUpManager('modal', 'modal__form_route', 'modal__form_register', 'modal__form_login', 'modal__form_profile', 'modal__alert_reg');
  window.myStorage = new MyStorage('local');
  window.myStorage.getItem('lastUserName')
    .then(
      result => {
        console.log(`MyStorage.js last user found: ${result}`);
        userAccount._restoreLastUser(result)
      },
      error => { console.log(error) }
    );
  window.userAccount = new UserAccount(myPopUpManager, myStorage.getItem, myStorage.setItem);
  window.weather = new Weather('https://api.openweathermap.org/data/2.5/forecast?mode=json&units=metric&APPID=0bc7c6edc6e5bc381e503d32151b71c9&lang=ru');
  window.googleMaps = new GoogleMaps("map");
  window.charts = new Charts('chart-canvas');

  googleMaps.initializeMap(66.788890, 93.775280, 3);
  googleMaps.addListenerOnDirChange(refreshWeatherOnDirChange);
  buttonSubmit.disabled = false;
}
document.getElementById('googleapisScript').onerror = function () {
  reject(new Error('googleapisScripts is unable to load'));
}

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
  myPopUpManager.popUpHide('modal__alert_reg');
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
  myPopUpManager.popUpHide('modal__alert_reg');
  window.myPopUpManager.popUpShow('modal__form_login');
  //add validation of input data here
  if ('if valid check with validator to be here') {
    buttonSubmitLogin.disabled = false;
  }
}

function callbackButtonLogout() {
  userAccount.logoutUser();
}

function callbackButtonProfile() {
  console.log('script.js callbackButtonProfile activated');
  window.myPopUpManager.popUpShow('modal__form_profile');
}

function callbackButtonSubmitLogin() {
  console.log('script.js callbackButtonSubmitLogin activated');
  var userObj = {
    userName: inputUsernameLogin.value,
    userEmail: null,
    userPassword: inputPasswordLogin.value
  };
  userAccount.loginUser(userObj, myPopUpManager.popUpHide.bind(myPopUpManager));
}

function callbackButtonTripAdd() {
  console.log('script.js callbackButtonTripAdd activated');
  if (userAccount.isUserLoggedIn()) {
    userAccount.applyTripFromUserBuffer();
  } else {
    myPopUpManager.popUpShow('modal__alert_reg');
    document.getElementById('modal__alert_reg_reg').addEventListener('click', callbackButtonRegister);
    document.getElementById('modal__alert_reg_log').addEventListener('click', callbackButtonLogin);
  }
}

function refreshWeatherOnDirChange() {
  let prom = weather.weatherForecast(googleMaps.getRoute());
  prom.then(
    response => {
      let stepWithWeatherAssigned = weather.assignWeatherToRoute(googleMaps.getRoute(), response);
      googleMaps.drawMarkers();
      console.log('stepWithWeatherAssigned: ', stepWithWeatherAssigned);
      userAccount.addTripToUserBuffer(inputFrom.value, inputTo.value, stepWithWeatherAssigned);
      charts.plotData(stepWithWeatherAssigned, 'temperature', 'precipitation');
      charts.addEventListenerOnMouseClick(googleMaps.centerAt.bind(googleMaps));
    });
}











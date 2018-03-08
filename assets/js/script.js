'use strict';

var buttonSubmit = document.getElementsByClassName('form-route__submit-button')[0];
var buttonRegister = document.getElementsByClassName("header-menu__register-button")[0];
var buttonLogin = document.getElementsByClassName("header-menu__login-button")[0];
var buttonLogout = document.getElementsByClassName("header-menu__logout-button")[0];
var buttonProfile = document.getElementsByClassName("header-menu__profile-button")[0];
var buttonSubmitRegistration = document.getElementsByClassName('form-register__submit-button')[0];
var buttonSubmitLogin = document.getElementsByClassName('form-login__submit-button')[0];
var buttonTripAdd = document.getElementsByClassName("trip-route__add-trip")[0];
var buttonProfileClose = document.getElementsByClassName('form-profile__close-button')[0];

buttonSubmit.addEventListener('click', callbackButtonSubmit);
buttonRegister.addEventListener('click', callbackButtonRegister);
buttonLogin.addEventListener('click', callbackButtonLogin);
buttonLogout.addEventListener('click', callbackButtonLogout);
buttonProfile.addEventListener('click', callbackButtonProfile)
buttonSubmitRegistration.addEventListener('click', callbackButtonSubmitRegistration);
buttonSubmitLogin.addEventListener('click', callbackButtonSubmitLogin);
buttonTripAdd.addEventListener('click', callbackButtonTripAdd);
buttonProfileClose.addEventListener('click', callbackButtonProfileClose);

var inputFrom = document.getElementsByClassName('form-route__origin-input')[0];
var inputTo = document.getElementsByClassName('form-route__destination-input')[0];
var inputTimeTripBegin = document.getElementsByClassName('form-route__time-txt')[0];
var inputStep = document.getElementsByClassName('form-route__step-input')[0];

var inputEmailRegister = document.getElementsByClassName('form-register__email-input')[0];
var inputPasswordRegister = document.getElementsByClassName('form-register__password-input')[0];
var inputUsernameRegister = document.getElementsByClassName('form-register__username-input')[0];

var inputPasswordLogin = document.getElementsByClassName('form-login__password-input')[0];
var inputUsernameLogin = document.getElementsByClassName('form-login__username-input')[0];

document.getElementById('googleapisScript').onload = function () {
  console.log('googleapisScripts loaded succesfully');
  window.myPopUpManager = new PopUpManager('modal', 'form-route', 'form-register', 'form-login', 'form-profile', 'alert-login-required');
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
    myPopUpManager.popUpHide('form-route');
  }
}

function callbackButtonRegister() {
  console.log('script.js callbackButtonRegister activated');
  myPopUpManager.popUpHide('alert-login-required');
  window.myPopUpManager.popUpShow('form-register');
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
  window.myPopUpManager.popUpHide('form-register');
}

function callbackButtonLogin() {
  console.log('script.js callbackButtonLogin activated');
  window.myPopUpManager.popUpHide('alert-login-required');
  window.myPopUpManager.popUpShow('form-login');
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
  window.myPopUpManager.popUpShow('form-profile');
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
    myPopUpManager.popUpShow('alert-login-required');
    document.getElementsByClassName('alert-login-required__register-button')[0].addEventListener('click', callbackButtonRegister);
    document.getElementsByClassName('alert-login-required__login-button')[0].addEventListener('click', callbackButtonLogin);
  }
}

function callbackButtonProfileClose() {
  window.myPopUpManager.popUpHide('form-profile');
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











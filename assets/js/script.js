'use strict';
var myUIManager = new UserInterfaceManager();

myUIManager.uiElementAddListenerByCSSclass('form-route__submit-button', 'click', callbackButtonSubmit);
myUIManager.uiElementAddListenerByCSSclass('menu-header__logout-button', 'click', callbackButtonLogout);
myUIManager.uiElementAddListenerByCSSclass('menu-header__profile-button', 'click', callbackButtonProfile);
myUIManager.uiElementAddListenerByCSSclass('form-register__submit-button', 'click', callbackButtonSubmitRegistration);
myUIManager.uiElementAddListenerByCSSclass('form-login__submit-button', 'click', callbackButtonSubmitLogin);
myUIManager.uiElementAddListenerByCSSclass('trip-route__add-trip-button', 'click', callbackButtonTripAdd);
myUIManager.uiElementAddListenerByCSSclass('register-button', 'click', callbackButtonRegister);
myUIManager.uiElementAddListenerByCSSclass('login-button', 'click', callbackButtonLogin);
myUIManager.uiElementAddListenerByCSSclass('close-button', 'click', callbackButtonClose);

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
  window.userAccount = new UserAccount(myPopUpManager, myUIManager, myStorage.getItem, myStorage.setItem);
  window.weather = new Weather('https://api.openweathermap.org/data/2.5/forecast?mode=json&units=metric&APPID=0bc7c6edc6e5bc381e503d32151b71c9&lang=ru');
  window.googleMaps = new GoogleMaps("map");
  window.charts = new Charts('chart-canvas');

  googleMaps.initializeMap(66.788890, 93.775280, 3);
  googleMaps.addListenerOnDirChange(refreshWeatherOnDirChange);
  myUIManager.uiElementSetEnable('form-route__submit-button');
}
document.getElementById('googleapisScript').onerror = function () {
  reject(new Error('googleapisScripts is unable to load'));
}

function callbackButtonSubmit() {
  console.log('script.js callbackButtonSubmit activated');

  let inputFromValue = myUIManager.uiElementGetValue('form-route__origin-input');
  let inputToValue = myUIManager.uiElementGetValue('form-route__destination-input');
  let inputStepValue = myUIManager.uiElementGetValue('form-route__step-input');
  let inputTimeTripBeginValue = myUIManager.uiElementGetValue('form-route__time-txt');

  if (validate('text-input', inputFromValue) && validate('text-input', inputToValue) && validate('step-input', inputStepValue)) {
    console.log('form validated');
    googleMaps.calcRoute(inputFromValue, inputToValue, inputStepValue * 1000, inputTimeTripBeginValue);
    document.getElementById('map').scrollIntoView();
    myPopUpManager.popUpHide('form-route');
  }
}

function callbackButtonRegister() {
  console.log('script.js callbackButtonRegister activated');
  myPopUpManager.popUpHide('alert-login-required');
  myPopUpManager.popUpShow('form-register');
  //add validation of input data here
  if ('if valid check with validator to be here') {
    myUIManager.uiElementSetEnable('form-register__submit-button');
  }
}

function callbackButtonSubmitRegistration() {
  console.log('script.js callbackButtonSubmitRegistration activated');

  let inputUsernameRegisterValue = myUIManager.uiElementGetValue('form-register__username-input');
  let inputEmailRegisterValue = myUIManager.uiElementGetValue('form-register__email-input');
  let inputPasswordRegisterValue = myUIManager.uiElementGetValue('form-register__password-input');

  var userObj = {
    userName: inputUsernameRegisterValue,
    userEmail: inputEmailRegisterValue,
    userPassword: inputPasswordRegisterValue
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
    myUIManager.uiElementSetEnable('form-login__submit-button');
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

  let inputUsernameLoginValue = myUIManager.uiElementGetValue('form-login__username-input');
  let inputPasswordLoginValue = myUIManager.uiElementGetValue('form-login__password-input');

  var userObj = {
    userName: inputUsernameLoginValue,
    userEmail: null,
    userPassword: inputPasswordLoginValue
  };
  userAccount.loginUser(userObj, myPopUpManager.popUpHide.bind(myPopUpManager));
}

function callbackButtonTripAdd() {
  console.log('script.js callbackButtonTripAdd activated');
  if (userAccount.isUserLoggedIn()) {
    userAccount.applyTripFromUserBuffer();

  } else {
    myPopUpManager.popUpShow('alert-login-required');
  }
}

function callbackButtonClose(e) {
  myPopUpManager.popUpHide(e.target.form.classList.value);
}

function refreshWeatherOnDirChange() {
  let prom = weather.weatherForecast(googleMaps.getRoute());
  prom.then(
    response => {
      let stepWithWeatherAssigned = weather.assignWeatherToRoute(googleMaps.getRoute(), response);
      googleMaps.drawMarkers();
      console.log('stepWithWeatherAssigned: ', stepWithWeatherAssigned);
      let inputFromValue = myUIManager.uiElementGetValue('form-route__origin-input');
      let inputToValue = myUIManager.uiElementGetValue('form-route__destination-input');
      userAccount.addTripToUserBuffer(inputFromValue, inputToValue, stepWithWeatherAssigned);
      charts.plotData(stepWithWeatherAssigned, 'temperature', 'precipitation');
      charts.addEventListenerOnMouseClick(googleMaps.centerAt.bind(googleMaps));
    });
}











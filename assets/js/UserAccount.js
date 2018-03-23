'use strict';
/**
 * A monster-class which represents all aspects of account related works. Refactoring expected.
 * Contains calendar, UI, account related methods of single user abstraction.
 */
class UserAccount {

    /**
     * Constructor creates new UserAccount obj
     * @param {obj} myPopUpManager instance of myPopUpManager class
     * @param {obj} myUIManager instance of myUIManager class
     * @param {function} getItem method of class with storage access
     * @param {function} setItem method of class with storage access
     * @return {obj} instance of UserAccount class
     */
    constructor(myPopUpManager, myUIManager, getItem, setItem) {
        this.mainCalendar = new MainCalendar('#mainCalendar', myPopUpManager.popUpShow, myUIManager.uiElementSetValue);
        this.profileCalendar = new ProfileCalendar('#profileCalendar', this.eventDeleteByCalendarButtonClick.bind(this));
        this.tripService = new TripService('http://localhost:8000/trips');
        this.userService = new UserService('http://localhost:8000/users');
        this.authService = new AuthService('http://localhost:8000/login');
        this.setItem = setItem;
        this.getItem = getItem;
        this.userToken = null;
        this.userObj = {
            userName: null,
            userPassword: null,
            userEmail: null,
        }
        this.tripTemp = {
            userName: '',
            tripOrigin: '',
            tripDest: '',
            tripData: ''
        }
    }

    /**
     * Method for temporary storage of created tripObj obj till it added by user into storages and calendars
     * @param {string} origin origin point of planned route
     * @param {string} destination destination point of planned route
     * @param {obj} tripWithWeather object contents route and weather combined
     * @return {null}
     */
    addTripToUserBuffer(origin, destination, tripWithWeather) {
        console.log('UserAccount.js addTripToUserBuffer with tripWithWeather: ', origin, destination, tripWithWeather);
        let temp = {
            userName: '',
            tripOrigin: '',
            tripDest: '',
            tripData: ''
        }
        temp['userName'] = this.userObj.userName;
        temp['tripOrigin'] = origin;
        temp['tripDest'] = destination;
        temp['tripData'] = tripWithWeather;
        this.tripTemp = temp;
        console.log(this.userData);
    }

    /**
     * Method to apply tripTemp obj from buffer into user profile.
     * Also adds applied data to calendars and to storage by calling related internal methods
     * @param {null}
     * @return {null}
     */
    applyTripFromUserBuffer() {
        if (this.tripTemp.tripOrigin) {
            console.log('UserAccount.js applyTripFromUserBuffer activated');

            this._addTripDataToServer()
                .then((response) => response.json())
                .then((tripObj) => {
                    console.log('UserAccount.js _addTripDataToServer', tripObj);
                    this._addDataToCalendar([tripObj]);
                });
        }
    }

    /**
     * Method to create new user from external userObj obj
     * Also adds user to storage, sets actual UI view and sets created user as last by 
     * calling related methods
     * @param {obj} userObj contents main user data
     * @return {null}
     */
    createUser(userObj) {
        console.log('UserAccount.js createUser with userObj: ', userObj);
        this.userObj = userObj;
        this._addDataToLocalStorage('userObj', userObj);
        this._addUserDataToServer()
            .then(response => response.json())
            .then(result => {
                console.log(result);
                this.loginUser(result, myPopUpManager.popUpHide);
                // this._restoreUserUIView(userObj);
                // this._setLastUser(userObj);
            })
            .catch(err => console.log(err));
    }

    /**
     * Method to delete single element from tripsObj. Methods emitted from profile calendar.
     * After removing of single element method adds changed tripsObj to server and into calendar by calling 
     * related internal methods.
     * @param {number} eventId id of element to delete
     * @return {null}
     */
    eventDeleteByCalendarButtonClick(eventId) {
        console.log(eventId);

        this.tripService.tripDelete(eventId)
            .then((message) => {
                console.log('UserAccount.js eventDeleteByCalendarButtonClick', message);
                if (message.status === 200) {
                    this.profileCalendar.removeEventsFromCalendar(eventId);
                    this.mainCalendar.removeEventsFromCalendar(eventId);
                }
            });
    }

    /**
     * Method to provide simple autentification of already registred user
     * Hides login form, hides alert form, sets last user, restores user data by calling related methods.
     * @param {obj} userObj contents main user data
     * @param {function} popUpHide method to hide popup window 
     * @return {null}
     */
    loginUser(userObj, popUpHide) {
        this.popUpHide = popUpHide;
        console.log('UserAccount.js loginUser with userObj: ', userObj);
        this.authService.loginUser(userObj)
            .then(response => {
                if (response.status !== 200) {
                    myUIManager.uiElementShow("form-login__alert-txt");
                    return Promise.reject(response);
                } else {
                    return response.json();
                }
            })
            .then(result => {
                console.log(result);
                this.popUpHide('form-login');
                myUIManager.uiElementHide("form-login__alert-txt");
                this._restoreLastSession(result._id);
            },
                error => console.log(error));
    }

    /**
     * Method to provide logout of logged user
     * Emitts internal method to restore default ui and data condition
     * @param {null} 
     * @return {null}
     */
    logoutUser() {
        console.log('UserAccount.js logoutUser()');
        this._restoreDefaultUIView();
        this.userObj.userName = null;
        this.mainCalendar.removeEventsFromCalendar();
        this.profileCalendar.removeEventsFromCalendar();
        // this._setLastUser({ userName: null });
    }

    /**
     * Method calls rerender of profile calendar 
     * @param {null} 
     * @return {null}
     */
    rerenderProfileCalendar() {
        this.profileCalendar.rerender();
    }

    /**
     * Method for check is any user already logged in
     * @param {null} 
     * @return {string} userName
     */
    isUserLoggedIn() {
        console.log(this.userObj.userName);
        return this.userObj.userName;
    }

    /**
     * Method adds user data to storage by calling related storage functions
     * @param {string} keyName name of data to write into storage
     * @param {string} keyValue data to write into storage
     * @return {null}
     */
    _addDataToLocalStorage(keyName, keyValue) {
        console.log('UserAccount.js _addDataToLocalStorage with keyName: ', keyName, keyValue);

        this.setItem(`${this.userObj.userName}_${keyName}`, keyValue)
            .then(result => { console.log('UserAccount.js data: ', keyValue, 'added with key: ', `${this.userObj.userName}_${keyName}`) },
                error => console.log);
    }

    _addTripDataToServer() {
        return this.tripService.tripCreate(this.tripTemp);
    }

    _addUserDataToServer() {
        return this.userService.userCreate(this.userObj);
    }

    /**
     * Method takes tripObj arr creates fullcalendar.js events and calls related calendar methods to display data 
     * @param {obj[]} tripsObj objects what represents single trip obj
     * @return {null}
     */
    _addDataToCalendar(tripsObj) {
        console.log('UserAccounts.js _addToCalendar with ', tripsObj);

        for (let i = 0; i < tripsObj.length; i++) {
            let start = moment(tripsObj[i].tripData[0].timeEnd).format();
            let end = moment(tripsObj[i].tripData[tripsObj[i].tripData.length - 1].timeEnd).format();
            let title = `${tripsObj[i].tripOrigin}-${tripsObj[i].tripDest}`;
            let id = tripsObj[i]._id;

            let eventData = {
                id: id,
                title: title,
                start: start,
                end: end
            }

            this.mainCalendar.addSingleEventToCalendar(eventData);
            this.profileCalendar.addSingleEventToCalendar(eventData);
        }

    }

    _setSessionToken(token) {
        this.userToken = token;
        this.userService.setToken(token);
        this.tripService.setToken(token);

        this.setItem(`lastSessionToken`, token)
            .then(result => { console.log(`UserAccount.js lastSessionToken set as : ${token}`) },
                error => console.log);
    }

    /**
     * Method takes last cached token emitts related internal methods to restore last session with user
     * @param {string} token contents token of last session
     * @return {null}
     */
    _restoreLastSession(token) {
        console.log(`UserAccount.js _restoreLastSession with token: "${token}"`);
        this._setSessionToken(token);

        this.userService.userReadByToken()
            .then(response => response.json())
            .then(user => {
                console.log(user);
                this.userObj = user;
                this._restoreUserUIView(user);
                this._restoreTripData(user);
            });
    }

    /**
     * Method to restore default UI by calling related myUIManager methods
     * @param {null}
     * @return {null}
     */
    _restoreDefaultUIView() {
        myUIManager.uiElementSetValue('username-txt', "Anonymous user");
        myUIManager.uiElementHide("menu-header__logout-button", "menu-header__profile-button");
        myUIManager.uiElementShow("menu-header__login-button", "menu-header__register-button");
    }

    /**
     * Method takes userObj restores data related to user`s trips
     * @param {obj} userObj contents main user data
     * @return {null}
     */
    _restoreTripData(userObj) {
        this.tripService.tripRead(userObj.userName)
            .then((response) => {
                console.log(response);
                return response.json();
            })
            .then((tripsObj) => {
                console.log('UserAccount.js _restoreTripData', tripsObj);
                this._addDataToCalendar(tripsObj);
            });
    }

    /**
     * Method to restore user UI by calling related myUIManager methods
     * @param {obj} userObj contents main user data
     * @return {null}
     */
    _restoreUserUIView(userObj) {
        myUIManager.uiElementSetValue('username-txt', userObj.userName);
        myUIManager.uiElementSetValue('email-txt', userObj.userEmail);
        myUIManager.uiElementShow("menu-header__logout-button", "menu-header__profile-button");
        myUIManager.uiElementHide("menu-header__login-button", "menu-header__register-button");
    }
}

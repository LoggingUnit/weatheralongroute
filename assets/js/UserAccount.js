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
        this.setItem = setItem;
        this.getItem = getItem;
        this.userData = {
            userObj: {
                userName: null,
                userPassword: null,
                userEmail: null,
            },
        }
        this.tripTemp = {
            user: '',
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
            user: '',
            tripOrigin: '',
            tripDest: '',
            tripData: ''
        }
        temp['user'] = this.userData.userObj.userName;
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

            this._addDataToServerNode()
                .then((response) => response.json())
                .then((tripObj) => {
                    console.log('UserAccount.js _addDataToServerNode', tripObj);
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
        this.userData.userObj = userObj;
        this._addDataToServer('userObj', userObj);
        this._restoreUserUIView(userObj);
        this._setLastUser(userObj);
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
            // .then((response) => response.text())
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
        console.log('UserAccount.js loginUser with userObj: ', userObj);
        this.getItem(`${userObj.userName}_userObj`)
            .then(result => {
                if (result.userPassword == userObj.userPassword) {
                    console.log(`UserAccount.js user: ${userObj.userName} succesfully passed`);
                    popUpHide('form-login');
                    myUIManager.uiElementHide("form-login__alert-txt");
                    this._setLastUser(userObj);
                    this._restoreUserData(userObj);
                } else {
                    console.log(`UserAccount.js user: ${userObj.userName} did no pass`);
                    myUIManager.uiElementShow("form-login__alert-txt");
                }
            }, error => {
                myUIManager.uiElementShow("form-login__alert-txt");
            });
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
        this.userData.userObj.userName = null;
        this.userData.tripsObj = [];
        this.mainCalendar.removeEventsFromCalendar();
        this.profileCalendar.removeEventsFromCalendar();
        this._setLastUser({ userName: null });
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
        console.log(this.userData.userObj.userName);
        return this.userData.userObj.userName;
    }

    /**
     * Method adds user data to storage by calling related storage functions
     * @param {string} keyName name of data to write into storage
     * @param {string} keyValue data to write into storage
     * @return {null}
     */
    _addDataToServer(keyName, keyValue) {
        console.log('UserAccount.js _addDataToServer with keyName: ', keyName, keyValue);

        this.setItem(`${this.userData.userObj.userName}_${keyName}`, keyValue)
            .then(result => { console.log('UserAccount.js data: ', keyValue, 'added with key: ', `${this.userData.userObj.userName}_${keyName}`) },
                error => console.log);
    }

    _addDataToServerNode() {
        return this.tripService.tripCreate(this.tripTemp);
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

    /**
     * Method takes userObj and set user as last user using storage methods
     * @param {obj} userObj contents main user data
     * @return {null}
     */
    _setLastUser(userObj) {
        this.setItem(`lastUserName`, userObj.userName)
            .then(result => { console.log(`UserAccount.js lastUserName set as : ${userObj.userName}`) },
                error => console.log);
    }

    /**DEVELOPMENT NEEDS
     * Method takes userName emitts related internal methods to restore last session with user
     * @param {string} userName contents user name
     * @return {null}
     */
    _restoreLastUser(userName) {
        console.log(`UserAccount.js _restoreLastUser with username: "${userName}"`);
        this.getItem(`${userName}_userObj`)
            .then(result => {
                this.userData.userObj = result;
                this._restoreUserData(result);
            }, error => console.log('UserAccount.js unable to restore user with username: ', userName));
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
     * Method takes userObj restores data related to user
     * @param {obj} userObj contents main user data
     * @return {null}
     */
    _restoreUserData(userObj) {
        this.getItem(`${userObj.userName}_userObj`)
            .then(result => {
                console.log('UserAccount.js _restoreUserData restored', result);
                this.userData.userObj = result;
                this._restoreUserUIView(this.userData.userObj);
            }, error => console.log('UserAccount.js unable to restore user with username: ', userObj.userName));

        this.tripService.tripRead(userObj.userName)
            .then((response) => response.json())
            .then((tripsObj) => {
                console.log('UserAccount.js _restoreUserData', tripsObj);
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

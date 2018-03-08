'use strict';

class UserAccount {

    constructor(myPopUpManager, getItem, setItem) {
        this.mainCalendar = new MainCalendar('#mainCalendar', myPopUpManager.popUpShow, myPopUpManager.setTime);
        this.profileCalendar = new ProfileCalendar('#profileCalendar', this.eventDeleteByCalendarButtonClick.bind(this));
        this.setItem = setItem;
        this.getItem = getItem;
        this.userData = {
            userObj: {
                userName: null,
                userPassword: null,
                userEmail: null,
            },
            tripsObj: []
        }
        this.tripTemp = {
            tripOrigin: '',
            tripDest: '',
            tripData: ''
        }
    }

    addTripToUserBuffer(origin, destination, tripWithWeather) {
        console.log('UserAccount.js addTripToUserBuffer with tripWithWeather: ', origin, destination, tripWithWeather);
        let temp = {
            tripOrigin: '',
            tripDest: '',
            tripData: ''
        }
        temp['tripOrigin'] = origin;
        temp['tripDest'] = destination;
        temp['tripData'] = tripWithWeather;
        this.tripTemp = temp;
        console.log(this.userData);
    }

    applyTripFromUserBuffer() {
        if (this.tripTemp.tripOrigin) {
            console.log('UserAccount.js applyTripFromUserBuffer activated');
            this.userData.tripsObj.push(this.tripTemp);
            this._addDataToServer(`tripsObj`, this.userData.tripsObj);
            this._addDataToCalendar(this.userData.tripsObj);
        }
    }

    createUser(userObj) {
        console.log('UserAccount.js createUser with userObj: ', userObj);
        this.userData.userObj = userObj;
        this._addDataToServer('userObj', userObj);
        this._restoreUserData(userObj);
        this._setLastUser(userObj);
    }

    eventDeleteByCalendarButtonClick(eventId) {
        console.log(eventId);
        console.log(this.userData.tripsObj.splice(eventId,1));
        this._addDataToServer(`tripsObj`, this.userData.tripsObj);
        this._addDataToCalendar(this.userData.tripsObj);
    }

    loginUser(userObj, popUpHide) {
        console.log('UserAccount.js loginUser with userObj: ', userObj);
        this.getItem(`${userObj.userName}_userObj`)
            .then(result => {
                if (result.userPassword == userObj.userPassword) {
                    console.log(`UserAccount.js user: ${userObj.userName} succesfully passed`);
                    popUpHide('form-login');
                    document.getElementsByClassName("form-login__alert-txt")[0].style.display = 'none';
                    this._setLastUser(userObj);
                    this._restoreUserData(userObj);
                } else {
                    console.log(`UserAccount.js user: ${userObj.userName} did no pass`);
                    document.getElementsByClassName("form-login__alert-txt")[0].style.display = 'block';
                }
            }, error => {
                document.getElementsByClassName("form-login__alert-txt")[0].style.display = 'block';
            });
    }

    logoutUser() {
        console.log('UserAccount.js logoutUser()');
        document.getElementsByClassName("header-menu__username-txt")[0].innerHTML = "Anonymous user";
        document.getElementsByClassName("header-menu__login-button")[0].style.display = 'block';
        document.getElementsByClassName("header-menu__register-button")[0].style.display = 'block';
        document.getElementsByClassName("header-menu__logout-button")[0].style.display = 'none';
        document.getElementsByClassName("header-menu__profile-button")[0].style.display = 'none';
        this.userData.userObj.userName = null;
        this.userData.tripsObj = [];
        this.mainCalendar.removeEventsFromCalendar();
        this.profileCalendar.removeEventsFromCalendar();
        this._setLastUser({ userName: null });
    }

    isUserLoggedIn() {
        console.log(this.userData.userObj.userName);
        return this.userData.userObj.userName;
    }

    _addDataToServer(keyName, keyValue) {
        console.log('UserAccount.js _addDataToServer with keyName: ', keyName, keyValue);
        this.setItem(`${this.userData.userObj.userName}_${keyName}`, keyValue)
            .then(result => { console.log('UserAccount.js data: ', keyValue, 'added with key: ', `${this.userData.userObj.userName}_${keyName}`) },
                error => console.log);
    }

    _addDataToCalendar(tripsObj) {
        console.log('UserAccounts.js _addToCalendar with ', tripsObj);
        this.mainCalendar.removeEventsFromCalendar();
        this.profileCalendar.removeEventsFromCalendar();

        // var eventArr = [];
        for (let i = 0; i < tripsObj.length; i++) {
            let start = moment(tripsObj[i].tripData[0].timeEnd).format();
            let end = moment(tripsObj[i].tripData[tripsObj[i].tripData.length - 1].timeEnd).format();
            let title = `${tripsObj[i].tripOrigin}-${tripsObj[i].tripDest}`;

            let eventData = {
                id: i,
                title: title,
                start: start,
                end: end
            }

            // eventArr.push(eventData);

            this.mainCalendar.addSingleEventToCalendar(eventData);
            this.profileCalendar.addSingleEventToCalendar(eventData);
        }
        // this.calendar.addArrOfEventToCalendar(eventArr);

    }

    _setLastUser(userObj) {
        this.setItem(`lastUserName`, userObj.userName)
            .then(result => { console.log(`UserAccount.js lastUserName set as : ${userObj.userName}`) },
                error => console.log);
    }

    //for dev needs
    _restoreLastUser(userName) {
        console.log(`UserAccount.js _restoreLastUser with username: "${userName}"`);
        this.getItem(`${userName}_userObj`)
            .then(result => {
                this.userData.userObj = result;
                this._restoreUserData(result);
            }, error => console.log('UserAccount.js unable to restore user with username: ', userName));
    }

    _restoreUserData(userObj) {
        this.getItem(`${userObj.userName}_userObj`)
            .then(result => {
                console.log('UserAccount.js _restoreUserData restored', result);
                this.userData.userObj = result;
                document.getElementsByClassName("header-menu__username-txt")[0].innerHTML = this.userData.userObj.userName;
                document.getElementsByClassName("header-menu__login-button")[0].style.display = 'none';
                document.getElementsByClassName("header-menu__register-button")[0].style.display = 'none';
                document.getElementsByClassName("header-menu__logout-button")[0].style.display = 'block';
                document.getElementsByClassName("header-menu__profile-button")[0].style.display = 'block';
                document.getElementsByClassName("form-profile__username-txt")[0].innerHTML = this.userData.userObj.userName;
                document.getElementsByClassName("form-profile__username-txt")[1].innerHTML = this.userData.userObj.userName;
                document.getElementsByClassName("form-profile__email-txt")[0].innerHTML = this.userData.userObj.userEmail;

            }, error => console.log('UserAccount.js unable to restore user with username: ', userObj.userName));

        this.getItem(`${userObj.userName}_tripsObj`)
            .then(result => {
                console.log('UserAccount.js _restoreUserData restored', result);
                this.userData.tripsObj = result;
                this._addDataToCalendar(result);
            }, error => {
                console.log('UserAccount.js unable to restore tripsObj with username: ', userObj.userName);
                this._addDataToServer('tripsObj', this.userData.tripsObj);
            });
    }

}

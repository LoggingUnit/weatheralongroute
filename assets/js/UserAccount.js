'use strict';

class UserAccount {

    constructor(getItem, setItem) {
        this.setItem = setItem;
        this.getItem = getItem;
        this.userData = {
            userObj: {
                userName: '',
                userPassword: '',
                userEmail: '',
            }
        };
    }

    createUser(userObj) {
        console.log('UserAccount.js createUser with userObj: ', userObj);
        this.userData.userObj = userObj;
        this._addDataToServer('userObj', userObj);
        this._restoreUserData(userObj);
        this._setLastUser(userObj);
    }

    loginUser(userObj, popUpHide) {
        console.log('UserAccount.js loginUser with userObj: ', userObj);
        this.getItem(`${userObj.userName}_userObj`)
            .then(result => {
                if (result.userPassword == userObj.userPassword) {
                    console.log(`UserAccount.js user: ${userObj.userName} succesfully passed`);
                    popUpHide('modal__form_login');
                    document.getElementsByClassName("modal__form_login__alert")[0].style.display = 'none';
                    this._setLastUser(userObj);
                    this._restoreUserData(userObj);
                } else {
                    console.log(`UserAccount.js user: ${userObj.userName} did no pass`);
                    document.getElementsByClassName("modal__form_login__alert")[0].style.display = 'block';
                }
            }, error => {
                document.getElementsByClassName("modal__form_login__alert")[0].style.display = 'block';
            });
    }

    logoutUser() {
        console.log('UserAccount.js logoutUser()');
        document.getElementsByClassName("header__username")[0].innerHTML = "Anonymous user";
        document.getElementsByClassName("header__login")[0].style.display = 'block';
        document.getElementsByClassName("header__register")[0].style.display = 'block';
        document.getElementsByClassName("header__logout")[0].style.display = 'none';
        document.getElementsByClassName("header__profile")[0].style.display = 'none';
        this.userData.userObj = null;
        this._setLastUser({ userName: null });
    }

    isUserLoggedIn() {
        console.log(this.userData.userObj);
        return this.userData.userObj;
    }

    _addDataToServer(keyName, keyValue) {
        console.log('UserAccount.js _addDataToServer with keyName: ', keyName, keyValue);
        this.setItem(`${this.userData.userObj.userName}_${keyName}`, keyValue)
            .then(result => { console.log('UserAccount.js data: ', keyValue, 'added with key: ', `${this.userData.userObj.userName}_${keyName}`) },
                error => console.log);
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
                console.log('USER DATA RESTORED');
                this.userData.userObj = result;
                document.getElementsByClassName("header__username")[0].innerHTML = this.userData.userObj.userName;
                document.getElementsByClassName("header__login")[0].style.display = 'none';
                document.getElementsByClassName("header__register")[0].style.display = 'none';
                document.getElementsByClassName("header__logout")[0].style.display = 'block';
                document.getElementsByClassName("header__profile")[0].style.display = 'block';
            }, error => console.log('UserAccount.js unable to restore user with username: ', userName));
    }
}

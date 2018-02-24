'use strict';

class UserAccount {

    constructor(getItem, setItem) {
        this.setItem = setItem;
        this.getItem = getItem;
        this.userName = '';
    }

    createUser(userObj) {
        console.log('UserAccount.js createUser with userObj: ', userObj);
        this.userName = userObj.userName;
        this._addDataToServer('userObj', userObj);
        this._setLastUser(userObj);
    }

    getAccDataByUsername(userName) {
        console.log(`UserAccount.js getAccDataByUsername with username: "${userName}"`);
        this.userName = userName;
        //add get data from server functional
    }

    loginUser(userObj) {
        console.log('UserAccount.js loginUser with userObj: ', userObj);
        this.getItem(`${userObj.userName}_userObj`)
            .then(result => {
                console.log(result);
                if (result.userPassword == userObj.userPassword) {
                    console.log(`UserAccount.js user: ${userObj.userName} succesfully passed`)
                } else { console.log(`UserAccount.js user: ${userObj.userName} did no pass`) }
            });
    }

    _addDataToServer(keyName, keyValue) {
        console.log('UserAccount.js _addDataToServer with keyName: ', keyName, keyValue);

        this.setItem(`${this.userName}_${keyName}`, keyValue)
            .then(result => { console.log('UserAccount.js data: ', keyValue, 'added with key: ', `${this.userName}_${keyName}`) },
                error => console.log);
    }

    _setLastUser(userObj) {
        console.log(userObj.userName)
        this.setItem(`lastUserName`, userObj.userName)
            .then(result => { console.log(`UserAccount.js lastUserName set as : ${userObj.userName}`) },
                error => console.log);
    }

}

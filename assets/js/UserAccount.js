'use strict';

class UserAccount {

    constructor(getItem, setItem, userName) {
        this.userName = userName || '';
    }

    getAccDataByUsername(userName) {
        console.log(`UserAccount.js getAccDataByUsername with username: "${userName}"`);
        this.userName = userName;
        //add get data from server functional
    }

    createUser(userObj) {
        console.log('UserAccount.js createUser with userObj: ', userObj);
    }

}

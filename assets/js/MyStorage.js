'use strict';

class MyStorage {

    constructor(mode) {
        this.mode = mode;
        this.userName = '';
    }

    getItem(keyName) {
        switch (this.mode) {
            case 'local':
                return new Promise((resolve, reject) => {
                    if (localStorage[`${this.userName}_${keyName}`]) {
                        let output = localStorage.getItem(`${this.userName}_${keyName}`);
                        resolve(JSON.parse(output));
                    } else reject(`MyStorage.js ${this.userName}_${keyName} not found in localStorage`);
                });
                break;

            default:
                console.log('MyStorage.js undefined storage mode');
        }
    }

    setItem(keyName, keyValue) {
        switch (this.mode) {
            case 'local':
                return new Promise((resolve, reject) => {
                    localStorage.setItem(`${this.userName}_${keyName}`, JSON.stringify(keyValue));
                    resolve();
                });
                break;
            
            default:
                console.log('MyStorage.js undefined storage mode');
        }
    }

    setUsername(userName) {
        this.userName = userName;
        console.log(`MyStorage.js user name set as ${userName}`);
    }
}
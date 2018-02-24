'use strict';

class MyStorage {

    constructor(mode) {
        this.mode = mode;

        this.getItem = this.getItem.bind(this);
        this.setItem = this.setItem.bind(this);
    }

    getItem(keyName) {
        switch (this.mode) {
            case 'local':
                return new Promise((resolve, reject) => {
                    if (localStorage[`${keyName}`]) {
                        let output = localStorage.getItem(`${keyName}`);
                        resolve(JSON.parse(output));
                    } else reject(`MyStorage.js ${keyName} not found in localStorage`);
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
                    localStorage.setItem(`${keyName}`, JSON.stringify(keyValue));
                    resolve();
                });
                break;
            
            default:
                console.log('MyStorage.js undefined storage mode');
        }
    }
}
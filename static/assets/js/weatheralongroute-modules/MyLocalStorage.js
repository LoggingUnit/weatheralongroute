'use strict';
/**
 * An interface to work with local storage 
 * Allows us to read and write data to local storage.
 */
class MyLocalStorage {

    /** 
     * Creates instance of MyLocalStorage class
     * @param {null}
     * @return {Object} instance of MyLocalStorage class
     */
    constructor() {
        this.getItem = this.getItem.bind(this);
        this.setItem = this.setItem.bind(this);
    }

    /**
     * Methods gets string as parameter and returns promise which tries to found object with such name 
     * in localStorage as soon as it found resolve function emitted whith parsed JSON of found object.
     * @param {string} keyName object with keyName to be found in localStorage
     * @return {Promise} Promise objects contents JSON parsed object with name 'keyName'from localStorage
     */
    getItem(keyName) {
        return new Promise((resolve, reject) => {
            if (localStorage[`${keyName}`]) {
                let output = localStorage.getItem(`${keyName}`);
                resolve(JSON.parse(output));
            } else reject(`MyStorage.js ${keyName} not found in localStorage`);
        });
    }

    /**
     * Methods gets two strings as parameter and returns promise to write stringified 'keyValue' with
     * defined 'keyName' into localStorage. In case of success resolve() emitted.
     * @param {string} keyName name of object to create in local storage
     * @param {string} keyValue value of object to create in local storage
     * @return {Promise} Promise objects with resolve() emitted as soon as writing done
     */
    setItem(keyName, keyValue) {
        return new Promise((resolve, reject) => {
            localStorage.setItem(`${keyName}`, JSON.stringify(keyValue));
            resolve();
        });

    }
}
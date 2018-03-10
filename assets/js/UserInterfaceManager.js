'use strict';

class UserInterfaceManager {

    constructor() {

    }

    uiElementSetValue(elemCssClass, value) {
        let collection = document.getElementsByClassName(elemCssClass);//.innerHTML = userObj.userName;
        for (let i = 0; i<collection.length; i++) {
            collection[i].innerHTML = value;
        }
    }

    uiElementGetValue(elemCssClass) {

    }

    uiElementShow(...args) {
        args.map((item, i, arr) => {
            let collection = document.getElementsByClassName(item);
            for (let i = 0; i<collection.length; i++) {
                collection[i].style.display = 'block';
            }
        });
    }

    uiElementHide(...args) {
        args.map((item, i, arr) => {
            let collection = document.getElementsByClassName(item);
            for (let i = 0; i<collection.length; i++) {
                collection[i].style.display = 'none';
            }
        });
    }
}
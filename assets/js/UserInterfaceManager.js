'use strict';

class UserInterfaceManager {

    constructor() {
        this.uiElementSetValue = this.uiElementSetValue.bind(this);
    }

    uiElementAddListenerByCSSclass(elemCssClass, eventType, callback) {
        let collection = document.getElementsByClassName(elemCssClass);
        for (let i = 0; i<collection.length; i++) {
            collection[i].addEventListener(eventType, callback);
        }
    }

    uiElementGetValue(elemCssClass) {
        return document.getElementsByClassName(elemCssClass)[0].value;
    }

    uiElementSetValue(elemCssClass, value) {
        let collection = document.getElementsByClassName(elemCssClass);
        for (let i = 0; i<collection.length; i++) {
            collection[i].value = value;
            collection[i].innerHTML = value;
        }
    }
    
    uiElementSetEnable(elemCssClass) {
        let collection = document.getElementsByClassName(elemCssClass);
        for (let i = 0; i<collection.length; i++) {
            collection[i].disabled = true;
        }
    }

    uiElementSetEnable(elemCssClass) {
        let collection = document.getElementsByClassName(elemCssClass);
        for (let i = 0; i<collection.length; i++) {
            collection[i].disabled = false;
        }
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
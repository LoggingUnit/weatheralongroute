'use strict';
/**
 * A class which provides methods to work with DOM elements and their content
 */
class UserInterfaceManager {

    /**
     * Constructor creates new UserInterfaceManager obj
     * @param {null}
     * @return {obj} instance of UserInterfaceManager class
     */
    constructor() {
        this.uiElementSetValue = this.uiElementSetValue.bind(this);
    }

    /**
     * Methods finds all DOM elements with defined CSS class and adds callbacks for each of them on defined event
     * @param {string} elemCssClass CSS class of DOM element we want to find
     * @param {string} eventType event type as in addEventListener
     * @param {function} callback function will be calles as soon as event is emitted
     * @return {null}
     */
    uiElementAddListenerByCSSclass(elemCssClass, eventType, callback) {
        let collection = document.getElementsByClassName(elemCssClass);
        for (let i = 0; i<collection.length; i++) {
            collection[i].addEventListener(eventType, callback);
        }
    }

    /**
     * Methods finds all DOM elements with defined CSS and returns value if first of them 
     * @param {string} elemCssClass CSS class of DOM element we want to find
     * @return {string} value of element found by CSS class
     */
    uiElementGetValue(elemCssClass) {
        return document.getElementsByClassName(elemCssClass)[0].value;
    }

    /**
     * Methods finds all DOM elements with defined CSS and sets defined value to all of them
     * @param {string} elemCssClass CSS class of DOM element we want to find
     * @param {string} value value to set as DOM element .value and .innerHTML
     * @return {null}
     */
    uiElementSetValue(elemCssClass, value) {
        let collection = document.getElementsByClassName(elemCssClass);
        for (let i = 0; i<collection.length; i++) {
            collection[i].value = value;
            collection[i].innerHTML = value;
        }
    }

    /**
     * Methods finds all DOM elements with defined CSS and disables all of them
     * @param {string} elemCssClass CSS class of DOM element we want to find
     * @return {null}
     */    
    uiElementSetDisable(elemCssClass) {
        let collection = document.getElementsByClassName(elemCssClass);
        for (let i = 0; i<collection.length; i++) {
            collection[i].disabled = true;
        }
    }

    /**
     * Methods finds all DOM elements with defined CSS and enables all of them
     * @param {string} elemCssClass CSS class of DOM element we want to find
     * @return {null}
     */    
    uiElementSetEnable(elemCssClass) {
        let collection = document.getElementsByClassName(elemCssClass);
        for (let i = 0; i<collection.length; i++) {
            collection[i].disabled = false;
        }
    }

    /**
     * Methods finds all DOM elements defined array of CSS classes and shows all of them
     * @param {string[]} array of string which contents CSS classes of DOM element we want to show
     * @return {null}
     */
    uiElementShow(...args) {
        args.map((item, i, arr) => {
            let collection = document.getElementsByClassName(item);
            for (let i = 0; i<collection.length; i++) {
                collection[i].style.display = 'block';
            }
        });
    }

    /**
     * Methods finds all DOM elements defined array of CSS classes and hides all of them
     * @param {string[]} array of string which contents CSS classes of DOM element we want to hide
     * @return {null}
     */
    uiElementHide(...args) {
        args.map((item, i, arr) => {
            let collection = document.getElementsByClassName(item);
            for (let i = 0; i<collection.length; i++) {
                collection[i].style.display = 'none';
            }
        });
    }
}
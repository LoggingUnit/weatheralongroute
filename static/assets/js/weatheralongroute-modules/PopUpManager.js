'use strict';
/**
 * A class to provide uniform methods to show and hide popups (modal windows)
 */
class PopUpManager {

    /** 
     * Creates instance of PopUpManager class
     * @param {string[]} collection of strings represents css classes of modal windows. First of them 
     * have to be 'modal' itself as main padding element of each modal window.
     * @return {Object} instance of PopUpManager class
     */
    constructor(...args) {
        this.collection = {};
        this.modal = args[0];

        this.popUpShow = this.popUpShow.bind(this);
        this.popUpHide = this.popUpHide.bind(this);

        args.map((item, i, arr) => this.collection[item] = document.getElementsByClassName(item));

        //?????//
        window.onkeydown = function (event) {
            var that = this;
            if (event.keyCode == 27) {
                myPopUpManager.popUpHide();
            }
        };
    }

    /** 
     * Method to show modal window with css class listed as argument
     * @param {string} objWithClass string represents css class of modal window we need to show. Element with
     * css class 'modal' appears together with any other modal window as main padding element of each modal window
     * @return {null} 
     */
    popUpShow(objWithClass) {
        if (this.collection.hasOwnProperty(objWithClass)) {
            this.collection[this.modal][0].style.display = 'flex';
            this.collection[objWithClass][0].style.display = 'block';
        } else { console.log(`PopUpManager.popUpShow(param) did not found element with CSS: ${objWithClass}`) };
    }

    /** 
     * Method to hide modal window with css class listed as argument
     * @param {(string|null)} objWithClass string represents css class of modal window we need to hide. Element with
     * css class 'modal' hides together with any other modal window as main padding element of each modal window.
     * in case objWithClass is empty all elements existed in this.collection will be hidden.
     * @return {null} 
     */
    popUpHide(objWithClass) {
        if (!objWithClass) {
            console.log("PopUpManager.js close all pop-up windows");
            // console.log(this.collection);
            for (var popUp in this.collection) {
                console.log(`PopUpManager.js ${popUp} closed`);
                this.collection[popUp][0].style.display = 'none';
            };
        } else if (this.collection.hasOwnProperty(objWithClass)) {
            this.collection[this.modal][0].style.display = 'none';
            this.collection[objWithClass][0].style.display = 'none';
            console.log(`PopUpManager.js ${objWithClass} closed`);
        } else { console.log(`PopUpManager.popUpHide(param) did not found element with CSS: ${objWithClass}`) };
    }
}
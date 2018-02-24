'use strict';

class PopUpManager {

    constructor(...args) {
        this.collection = {};
        this.modal = args[0];

        this.popUpShow = this.popUpShow.bind(this);
        this.setTime = this.setTime.bind(this);
        args.map((item, i, arr) => this.collection[item] = document.getElementsByClassName(item));
        // console.log(this.collection);

        //?????//
        window.onkeydown = function (event) {
            var that = this;
            if (event.keyCode == 27) {
                myPopUpManager.popUpHide();
                // console.log( 'escape pressed' );
            }
        };
    }

    popUpShow(objWithClass) {
            if (this.collection.hasOwnProperty(objWithClass)) {
                this.collection[this.modal][0].style.display = 'flex';
                this.collection[objWithClass][0].style.display = 'block';
            } else { console.log(`PopUpManager.popUpShow(param) did not found element with CSS: ${objWithClass}`) };
    }

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

    setTime(inputTimeTripBegin) {
        window.inputTimeTripBegin.innerHTML = inputTimeTripBegin;
    }
}
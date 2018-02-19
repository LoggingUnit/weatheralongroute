'use strict';

class PopUpManager {

    constructor(...args) {
        this.collection = {};
        this.modal = args[0];
        args.map((item, i, arr) => this.collection[item] = document.getElementsByClassName(item));

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
        console.log('kek');
            if (this.collection.hasOwnProperty(objWithClass)) {
                this.collection[this.modal][0].style.display = 'flex';
                this.collection[objWithClass][0].style.display = 'block';
            } else { console.log(`PopUpManager.popUpShow(param) did not found element with CSS: ${objWithClass}`) };
        
        
    }

    popUpHide(objWithClass) {
        if (!objWithClass) {
            console.log("close all pop-up windows");
            console.log(this.collection);
            for (var popUp in this.collection) {
                console.log(`${popUp} closed`);
                this.collection[popUp][0].style.display = 'none';
            };
        } else if (this.collection.hasOwnProperty(objWithClass)) {
            this.collection[this.modal][0].style.display = 'none';
            this.collection[objWithClass][0].style.display = 'none';
        } else { console.log(`PopUpManager.popUpHide(param) did not found element with CSS: ${objWithClass}`) };
    }
}
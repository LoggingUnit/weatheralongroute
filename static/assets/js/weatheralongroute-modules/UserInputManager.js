'use strict';
/**
 */
class UserInputManager {

    /**
     * Constructor creates new UserInterfaceManager obj
     */
    constructor(validator, myUIManager) {
        this.validator = validator;
        this.myUIManager = myUIManager;

        this.userNameValid = false;
        this.userPasswordValid = false;
        this.userEmailValid = false;

        this.processRegisterInput = this.processRegisterInput.bind(this);
    }

    /**
     */
    processRegisterInput(e) {
        switch(e.target.className) {
            case 'form-register__username-input': {
                this.userNameValid = this.validator.validateAsCredentials(e.target.value);
                break;
            }
            case 'form-register__password-input': {
                this.userPasswordValid = this.validator.validateAsCredentials(e.target.value);
                break;
            }
            case 'form-register__email-input': {
                this.userEmailValid = this.validator.validateAsEmail(e.target.value);
                break;
            }
            default: {
                console.log('UserInputManager.js no case found', e.target.className);
            }
        }
        console.log(this.userNameValid , this.userPasswordValid , this.userEmailValid)
        if (this.userNameValid && this.userPasswordValid && this.userEmailValid) {
            this.myUIManager.uiElementSetEnable('form-register__submit-button');
        } else {
            this.myUIManager.uiElementSetDisable('form-register__submit-button');
        }
        

    }


}

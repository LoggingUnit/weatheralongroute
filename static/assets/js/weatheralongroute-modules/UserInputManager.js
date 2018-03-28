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

        this.inputFromValid = true;
        this.inputToValid = true;
        this.inputStepValid = true;
        this.inputTimeTripBeginValid = true;

        this.processRegisterInput = this.processRegisterInput.bind(this);
        this.processLoginInput = this.processLoginInput.bind(this);
        this.processTripInput = this.processTripInput.bind(this);
    }

    /**
     */
    processRegisterInput(e) {
        switch (e.target.className) {
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
        console.log(this.userNameValid, this.userPasswordValid, this.userEmailValid);
        if (this.userNameValid && this.userPasswordValid && this.userEmailValid) {
            this.myUIManager.uiElementSetEnable('form-register__submit-button');
            this.myUIManager.uiElementHide("form-register__info-txt")
        } else {
            this.myUIManager.uiElementSetDisable('form-register__submit-button');
            this.myUIManager.uiElementShow("form-register__info-txt")
        }
    }

    processLoginInput(e) {
        switch (e.target.className) {
            case 'form-login__username-input': {
                this.userNameValid = this.validator.validateAsCredentials(e.target.value);
                break;
            }
            case 'form-login__password-input': {
                this.userPasswordValid = this.validator.validateAsCredentials(e.target.value);
                break;
            }
            default: {
                console.log('UserInputManager.js no case found', e.target.className);
            }
        }
        console.log(this.userNameValid, this.userPasswordValid);
        if (this.userNameValid && this.userPasswordValid) {
            this.myUIManager.uiElementSetEnable('form-login__submit-button');
            this.myUIManager.uiElementHide("form-login__info-txt")
        } else {
            this.myUIManager.uiElementSetDisable('form-login__submit-button');
            this.myUIManager.uiElementShow("form-login__info-txt")
        }
    }

    processTripInput(e) {
        console.log(e);
        switch (e.target.className) {
            case 'form-route__origin-input': {
                this.inputFromValid = this.validator.validateAsText(e.target.value);
                break;
            }
            case 'form-route__destination-input': {
                this.inputToValid = this.validator.validateAsText(e.target.value);
                break;
            }
            case 'form-route__step-input': {
                this.inputStepValid = this.validator.validateAsStepDistance(e.target.value);
                break;
            }

            default: {
                console.log('UserInputManager.js no case found', e.target.className);
            }
        }
        console.log(this.inputFromValid, this.inputToValid, this.inputStepValid);
        if (this.inputFromValid && this.inputToValid && this.inputStepValid) {
            this.myUIManager.uiElementSetEnable('form-route__submit-button');
        } else {
            this.myUIManager.uiElementSetDisable('form-route__submit-button');
        }
    }

    getRegistrationData() {
        let inputUsernameRegisterValue = this.myUIManager.uiElementGetValue('form-register__username-input');
        let inputEmailRegisterValue = this.myUIManager.uiElementGetValue('form-register__email-input');
        let inputPasswordRegisterValue = this.myUIManager.uiElementGetValue('form-register__password-input');

        this.userNameValid = this.validator.validateAsCredentials(inputUsernameRegisterValue);
        this.userPasswordValid = this.validator.validateAsCredentials(inputPasswordRegisterValue);
        this.userEmailValid = this.validator.validateAsEmail(inputEmailRegisterValue);

        if (this.userNameValid && this.userPasswordValid && this.userEmailValid) {
            var userObj = {
                userName: inputUsernameRegisterValue,
                userEmail: inputEmailRegisterValue,
                userPassword: inputPasswordRegisterValue
            };
            return userObj;
        } else {
            console.log('UserInputManager.js getRegistrationData() something went wrong');
        }
    }

    getLoginData() {
        let inputUsernameLoginValue = myUIManager.uiElementGetValue('form-login__username-input');
        let inputPasswordLoginValue = myUIManager.uiElementGetValue('form-login__password-input');

        this.userNameValid = this.validator.validateAsCredentials(inputUsernameLoginValue);
        this.userPasswordValid = this.validator.validateAsCredentials(inputPasswordLoginValue);

        if (this.userNameValid && this.userPasswordValid) {
            var userObj = {
                userName: inputUsernameLoginValue,
                userEmail: null,
                userPassword: inputPasswordLoginValue
            };
            return userObj;
        } else {
            console.log('UserInputManager.js getLoginData() something went wrong');
        }
    }

    getTripData() {
        let inputFromValue = myUIManager.uiElementGetValue('form-route__origin-input');
        let inputToValue = myUIManager.uiElementGetValue('form-route__destination-input');
        let inputStepValue = myUIManager.uiElementGetValue('form-route__step-input');
        let inputTimeTripBeginValue = myUIManager.uiElementGetValue('form-route__time-txt');

        this.inputFromValid = this.validator.validateAsText(inputFromValue);
        this.inputToValid = this.validator.validateAsText(inputToValue);
        this.inputStepValid = this.validator.validateAsStepDistance(inputStepValue);
        this.inputTimeTripBeginValid = this.validator.validateAsText(inputTimeTripBeginValue);

        if (this.inputFromValid && this.inputToValid && this.inputStepValid && this.inputTimeTripBeginValid) {
            var tripRequestObj = {
                origin: inputFromValue,
                destination: inputToValue,
                step: inputStepValue*1000,
                timeTripBegin: inputTimeTripBeginValue
            };
            return tripRequestObj;
        } else {
            console.log('UserInputManager.js getTripData() something went wrong');
        }
    }
}
'use strict';
/**
 */
class Validator {

    constructor(endpoint) {
        this.endpoint = endpoint;
        this.credentialsRule = null;
        this.emailRule = null;
        this._getRulesFromServer(endpoint);
    }

    validateAsCredentials(inputText) {
        let regExp = new RegExp(this.credentialsRule);
        return regExp.test(inputText);
    }

    validateAsEmail(inputText) {
        let regExp = new RegExp(this.emailRule);
        return regExp.test(inputText);
    }

    validateAsText(inputText) {
        return !!inputText;
    }

    _getRulesFromServer(endpoint) {
        fetch(endpoint)
            .then(response => {
                return response.text();
            })
            .then(result => {
                let arr = result.split('splitHere');
                this._setCredentialsRule(arr[0]);
                this._setEmailRule(arr[1]);
            })
            .catch(err => {
                console.log(err);
                this._setCredentialsRule();
                this._setEmailRule();
            });

    }

    _setCredentialsRule(rule) {
        console.log(rule);
        this.credentialsRule = rule || `^[a-zA-Z0-9]([._](?![._])|[a-zA-Z0-9]){2,18}[a-zA-Z0-9]$`;
    }

    _setEmailRule(rule) {
        console.log(rule);
        this.emailRule = rule || `^(([^<>()\\[\\]\\\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\\.)+[a-zA-Z]{2,}))$`;
    }
}
/**
 * A function to provide validation to user input fiels
 */
function validate(typeOfValidation, value) {
    let output = false;
    let regExpLogin = /^[a-zA-Z0-9]([._](?![._])|[a-zA-Z0-9]){2,18}[a-zA-Z0-9]$/;
    let regExpEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    switch (typeOfValidation) {
        case 'text-input':
            if (value) {
                output = true;
            }
            break;

        case 'login-input':
            output = regExpLogin.test(value);
            break;

        case 'email-input':
            output = regExpEmail.test(value);
            break;

        case 'step-input':
            if (value >= 30) {
                output = true;
            }
            break;

        default: console.log('validate.js unknown validation type');
            break;
    }
    console.log(output);
    //////return output;
    return true;
}

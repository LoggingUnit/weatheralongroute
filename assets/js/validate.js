function validate(typeOfValidation, value) {
    let output = false;

    switch (typeOfValidation) {
        case 'text-input':
            if (value) {
                output = true;
            }
            break;

        case 'step-input':
            if (value >= 30) {
                output = true;
            }
            break;

        default: console.log('validate.js unknown validation type');
        break;
    }

    return output;
}

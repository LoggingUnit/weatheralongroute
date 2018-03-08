function validate(arg) {
    let output = false;
    arg.classList.forEach(element => {
        switch (element) {
            case 'form-route__origin-input':
                if (arg.value) {
                    output = true;
                }
                break;

            case 'form-route__destination-input':
                if (arg.value) {
                    output = true;
                }
                break;

            case 'inputOffset':
                if ((arg.value >= 0) && (arg.value <= 36)) {
                    output = true;
                }
                break;

            case 'form-route__step-input':
                if (arg.value >= 30) {
                    output = true;
                }
                break;

            default: break;
        }
    });
    return output;
}

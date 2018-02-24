function validate(arg) {
    switch (arg.id) {
        case 'inputFrom':
            if (arg.value) {
                return true;
            }
            break;

        case 'inputTo':
            if (arg.value) {
                return true;
            }
            break;

        case 'inputOffset':
            if ((arg.value >= 0) && (arg.value <= 36)) {
                return true;
            }
            return false;
            break;

        case 'inputStep':
            if (arg.value >= 30) {
                return true;
            }
            return false;
            break;

        default:
            return false;
    }
}

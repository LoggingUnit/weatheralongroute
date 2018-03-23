'use strict';
/**
 */
class AuthService {
    constructor(endPoint) {
        this.endPoint = endPoint;
        console.log(this.endPoint);
    }

    loginUser(userObj) {
        return fetch(this.endPoint, {
            method: 'POST',
            body: JSON.stringify(userObj),
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
        });
    }
}
'use strict';
/**
 */
class AuthService {
    constructor(endPoint) {
        this.endPoint = endPoint;
        this.token = null;
        console.log(this.endPoint);
    }

    setToken(token) {
        this.token = token;
    }

    loginUser(userObj) {
        return fetch(`${this.endPoint}/login`, {
            method: 'POST',
            body: JSON.stringify(userObj),
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
        });
    }

    logoutUser(userObj) {
        return fetch(`${this.endPoint}/logout`, {
            method: 'DELETE',
            body: JSON.stringify(userObj.userName),
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`,
            },
        });
    }


}
'use strict';
/**
 */
class UserService {
    constructor(endPoint) {
        this.endPoint = endPoint;
        this.token = null;
        console.log(this.endPoint);
    }

    setToken(token) {
        this.token = token;
    }

    userCreate(userObj) {
        return fetch(this.endPoint, {
            method: 'POST',
            body: JSON.stringify(userObj),
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
        });
    }

    userReadByToken() {
        return fetch(`${this.endPoint}/${this.token}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.token}`,
            },
        });
    }

    userDelete(id) {
        return fetch(`${this.endPoint}/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${this.token}`,
            },
        });
    }
}
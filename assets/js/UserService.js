'use strict';
/**
 */
class UserService {
    constructor(endPoint) {
        this.endPoint = endPoint;
        console.log(this.endPoint);
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

    userRead(user) {
        return fetch(`${this.endPoint}/${user}`, {
            method: 'GET',
        });
    }

    userDelete(id) {
        return fetch(`${this.endPoint}/${id}`, {
            method: 'DELETE',
        });
    }
}
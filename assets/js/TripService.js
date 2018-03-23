'use strict';
/**
 */
class TripService {
    constructor(endPoint) {
        this.endPoint = endPoint;
        this.token = null;
        console.log(this.endPoint);
    }

    setToken(token) {
        console.log('TripService.js setToken ', token);
        this.token = token;
    }

    tripCreate(tripObj) {
        console.log(this.token);
        return fetch(this.endPoint, {
            method: 'POST',
            body: JSON.stringify(tripObj),
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`
            },
        });
    }

    tripRead(user) {
        console.log(this.token);
        return fetch(`${this.endPoint}/${user}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.token}`,
            },
        });
    }

    tripDelete(id) {
        return fetch(`${this.endPoint}/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${this.token}`,
            },
        });
    }
}
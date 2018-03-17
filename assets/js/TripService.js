'use strict';
/**
 */
class TripService {
    constructor(endPoint) {
        this.endPoint = endPoint;
        console.log(this.endPoint);
    }

    tripCreate(tripObj) {
        return fetch(this.endPoint, {
            method: 'POST',
            body: JSON.stringify(tripObj),
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
        });
    }

    tripRead(user) {
        return fetch(`${this.endPoint}/${user}`, {
            method: 'GET',
        });
    }

    tripDelete(id) {
        return fetch(`${this.endPoint}/${id}`, {
            method: 'DELETE',
        });
    }
}
'use strict';
/**
 * A class which provides all client related to trips communications with backend.
 */
class TripService {

    /**
     * Constructor creates instance of TripService class
     * @param {string} endPoint address of backend endpoint for trips service
     * @return {Object} instance of TripService class
     */
    constructor(endPoint) {
        this.endPoint = endPoint;
        this.token = null;
        console.log(this.endPoint);
    }

    /**
     * Setter method for token change in instance of class
     * @param {string} token new token to set
     */
    setToken(token) {
        this.token = token;
    }

    /**
     * Method sends tripObj to backend to create new trip
     * @param {Object} tripObj contents main trip data
     * @returns {fetch}
     */
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

    /**
     * Method reads all trip related to entered user from backend
     * @param {Object} tripObj contents main trip data
     * @returns {fetch}
     */
    tripRead(user) {
        console.log(this.token);
        return fetch(`${this.endPoint}/${user}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.token}`,
            },
        });
    }

    /**
     * Method sends DELETE for trip with entered id to backend
     * @param {string} id of trip to delete
     * @returns {fetch}
     */
    tripDelete(id) {
        return fetch(`${this.endPoint}/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${this.token}`,
            },
        });
    }
}
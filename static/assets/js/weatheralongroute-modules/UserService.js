'use strict';
/**
 * A class which provides all client related user data communications with backend.
 */
class UserService {

    /**
     * Constructor creates instance of UserService class
     * @param {string} endPoint address of backend endpoint for user service
     * @return {Object} instance of UserService class
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
     * Method sends userObj to backend to create new user
     * @param {Object} userObj contents main trip data
     * @returns {fetch}
     */
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

    /**
     * Method sends token from instance of UserService class (as part of header) to backend to
     * recieve user data by token
     * @param {null}
     * @returns {fetch}
     */
    userReadByToken() {
        return fetch(`${this.endPoint}/${this.token}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.token}`,
            },
        });
    }

    /**
     * Method sends DELETE for user with entered id to backend
     * @param {string} id of trip to delete
     * @returns {fetch}
     */
    userDelete(id) {
        return fetch(`${this.endPoint}/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${this.token}`,
            },
        });
    }
}
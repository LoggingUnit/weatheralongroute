'use strict';
/**
 * A class which provides all client related auth. communications with backend.
 */
class AuthService {

    /**
     * Constructor creates instance of AuthService class
     * @param {string} endpoint address of backend endpoint for auth service
     * @return {Object} instance of AuthService class
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
     * Method sends userObj to backend to login user 
     * @param {Object} userObj contents main user data
     * @returns {fetch}
     */
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

    /**
     * Method sends userObj to backend to logout user 
     * @param {Object} userObj contents main user data
     * @returns {fetch}
     */
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
// static_routes.js
const express = require('express');
const credentialsRule = require('../../config/validationRules').credentialsRule;
const emailRule = require('../../config/validationRules').emailRule;

module.exports = function (app, db) {

  app.get('/validation', validationGetController);

  app.post('/users', validateUsersPostController);
  app.post('/trips', validateTripsPostController);

  function validationGetController(req, res, next) {
    res.send(`${credentialsRule}splitHere${emailRule}`);
  }

  function validateUsersPostController(req, res, next) {
    if (!validateUsersPost(req.body)) {
      console.log(`Validation failed: incorrect data to ${req.method} by following URL:${req.originalUrl}`);
      res.status(400).send({ error: `Validation failed: incorrect data to ${req.method} by following URL:', ${req.originalUrl}` });
    } else {
      console.log(`Validation passed: correct data to ${req.method} by following URL:${req.originalUrl}`);
      next();
    }
  }

  function validateTripsPostController(req, res, next) {
    if (!validateTripsPost(req.body)) {
      console.log(`Validation failed: incorrect data to ${req.method} by following URL:${req.originalUrl}`);
      res.status(400).send({ error: `Validation failed: incorrect data to ${req.method} by following URL:', ${req.originalUrl}` });
    } else {
      console.log(`Validation passed: correct data to ${req.method} by following URL:${req.originalUrl}`);
      next();
    }
  }

  function validateUsersPost(userObj) {
    console.log(userObj);
    let userNameValid = validateAsCredentials(userObj.userName);
    let userPasswordValid = validateAsCredentials(userObj.userPassword);
    let userEmailValid = validateAsEmail(userObj.userEmail);
    return userNameValid && userPasswordValid && userEmailValid;
  }

  function validateTripsPost(tripObj) {
    console.log(tripObj);
    let userNameValid = validateAsCredentials(tripObj.userName);
    return userNameValid;
  }

  function validateAsCredentials(text) {
    let regEpx = new RegExp(credentialsRule);
    return regEpx.test(text);
  }

  function validateAsEmail(text) {
    let regEpx = new RegExp(emailRule);
    return regEpx.test(text);
  }
};

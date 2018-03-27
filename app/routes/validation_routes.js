// static_routes.js
const express = require('express');
const credentialsRule = require('../../config/validationRules').credentialsRule;
const emailRule = require('../../config/validationRules').emailRule;

module.exports = function (app, db) {

  app.get('/validation', validationGetController);
  app.post('/validation', validationPostController);

  function validationGetController(req, res, next) {
    res.send(`${credentialsRule}splitHere${emailRule}`);
  }

  function validationPostController(req, res, next) {
    
  }
  
};

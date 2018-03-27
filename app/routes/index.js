// routes/index.js
const staticRoutes = require('./static_routes');
const authRoutes = require('./auth_routes');
const validationRoutes = require('./validation_routes');
const tripsRoutes = require('./trips_routes');
const usersRoutes = require('./users_routes');

module.exports = function(app, db) {
  staticRoutes(app, db);
  authRoutes(app, db);
  validationRoutes(app, db);
  tripsRoutes(app, db);
  usersRoutes(app, db);
};
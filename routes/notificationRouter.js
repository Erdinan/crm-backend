const express = require('express');
const notificationRouter = express.Router();

// require the contact controller
var notificationController = require('../controllers/notificationController');

// handle the GET request to notify the updated event
// notificationRouter.post('/edit', (req, res) => notificationController.notificationEdit(req, res));

// handle the GET request to notify the deleted event
notificationRouter.post('/delete', (req, res) => notificationController.notificationDelete(req, res));

// export the router
module.exports = notificationRouter;
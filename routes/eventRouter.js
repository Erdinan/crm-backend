const express = require('express');
const eventRouter = express.Router();

// require the contact controller
var eventController = require('../controllers/eventController');

// handle the GET request to get all events
eventRouter.get('/', (req, res) => eventController.getAllEvents(req, res));

// handle the GET request to get specific events
eventRouter.get('/filter', (req, res) => eventController.getSpecificEvent(req, res));

// handle the GET request to get one event
eventRouter.get('/:id', (req, res) => eventController.getOneEvent(req, res));

// handle POST requests to add one contact
eventRouter.post('/', (req, res) => eventController.createEvent(req, res));

// handle POST requests to update a contact
eventRouter.post('/edit/:id', (req, res) => eventController.editEvent(req, res));

// handle DELETE requests to delete a contact
eventRouter.delete('/:id', (req, res) => eventController.deleteEvent(req, res));

// export the router
module.exports = eventRouter;
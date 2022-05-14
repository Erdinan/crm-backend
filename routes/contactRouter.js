const express = require('express');
const contactRouter = express.Router();

// require the contact controller
var contactController = require('../controllers/contactController');

// handle the GET request to get all contacts
contactRouter.get('/', (req, res) => contactController.getAllContacts(req, res));

// handle the GET request to get one contact
contactRouter.get('/:id', (req, res) => contactController.getOneContact(req, res));

// handle POST requests to add one contact
contactRouter.post('/', (req, res) => contactController.createContact(req, res));

contactRouter.get('/profile', (req, res) => contactController.getOneProfile(req, res));

// handle POST requests to update a contact
contactRouter.post('/edit', (req, res) => contactController.editContact(req, res));

// handle DELETE requests to delete a contact
contactRouter.delete('/:id', (req, res) => contactController.deleteContact(req, res));

// export the router
module.exports = contactRouter;
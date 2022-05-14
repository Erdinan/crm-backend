const express = require('express');
const departmentRouter = express.Router();

// require the department controller
var departmentController = require('../controllers/departmentController');

//GET request to get one department
departmentRouter.get('/:name', departmentController.getOne)

//GET request to get all department
departmentRouter.get('/', departmentController.getAll)

//POST request to create a new department
departmentRouter.post('/create', departmentController.createOne)

//POST request to delete a department
departmentRouter.post('/delete/:name', departmentController.deleteOne)



// export the router
module.exports = departmentRouter;
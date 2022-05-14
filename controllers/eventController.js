// import contact model
const Event = require('../models/event');

// turn string into objectId
const objectId = require('mongodb').ObjectID;

//get all events
const getAllEvents = async (req, res) => {
    try {
        //get events related to the userId from the req.session
        const events = await Event.find({userId: objectId(req.session.userId)}).lean();
        // const events = await Event.find({userId: objectId('6123be502afc875770f07ef9')}).lean();
        return res.send(events);
    } catch (err) { // error occured
        res.status(400);
        return res.send("Database query failed");
    }
};

// find one event by their id
const getOneEvent = async (req, res) => {
    try {
        const oneEvent = await Event.findOne({_id: objectId(req.params.id)}).lean();
        if (oneEvent === null) {  // no event found in database
            res.status(404);
            return res.send("Event not found");
        }
        return res.send(oneEvent);
    } catch (err) { // error occured
        res.status(400);
        return res.send("Database query failed");
    }
};

// find one specific event based on specific field
const getSpecificEvent = async (req, res) => {
    try {
        const specificEvent = await Event.find(req.body).lean(); // get specific event based on post body
        if (specificEvent === null) {  // no event found in database
            res.status(404);
            return res.send("Event not found");
        }
        return res.send(specificEvent);
    } catch (err) { // error occured
        res.status(400);
        return res.send("Database query failed");
    }
};

// create new Event (POST)
const createEvent = async (req, res) => {
    const event = new Event(req.body); //create new event from POST body
    event.userId = objectId(req.session.userId)
    // event.userId = objectId('6123be502afc875770f07ef9')
    try { 
        let result = await event.save(); // save the new event to the database
        return res.send(result);
    } catch (err) { // error occured
        res.status(400);
        return res.send("Database insert failed");
    }
};

// update an event (POST)
const editEvent = async (req, res) => {
    try {
        const body = (req.body)
        const result = await Event.findOneAndUpdate({_id: objectId(req.params.id)}, body, {new:true}); //find the event, and update it with new data 
        if (!result) { // if event is not found in database, returns an error
            res.status(400);
            return res.send("Event not found in database");
        }
        return res.send(result);
    } catch (err) { // error detected
        res.status(400);
        return res.send("Database update failed");
    }
};

// delete an event (DELETE)
const deleteEvent = async (req, res) => {
    try { 
        await Event.findOneAndDelete({_id: objectId(req.params.id)}); // delete event based on the given id
        return res.send("Event is successfully deleted");
    } catch (err) { // error detected
        res.status(400);
        return res.send("Database delete failed");
    }
};

module.exports = {
    getAllEvents, getSpecificEvent, getOneEvent, createEvent, editEvent, deleteEvent
};
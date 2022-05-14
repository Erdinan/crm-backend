// import contact model & nodemailer
const Events = require('../models/event');
const Contacts = require('../models/contact');
const Users = require('../models/users')
const nodemailer = require('nodemailer')
const momentTimezone = require('moment-timezone')
const objectId = require('mongodb').ObjectID;

// get participants of event based on event id
const getParticipants = async (ids) => {
    const participants = await Contacts.find({_id : { $in: ids}}).lean()
    const participantNames = participants.map(participant => (participant.contactName))
    return participantNames
}

//get the user
const getUser = async(userId) => {
    const user = await Users.findOne({_id: objectId(userId)}).lean()
    return user
}

// send notification to notify the result of deleting an event
const notificationDelete = async (req, res) => {
    try {
        const timeFormat = "DD/MM/YY, hh:mm a"
        // store the event from the request body and the user details
        const event = req.body
        const user = await getUser(req.session.userId)
        const email = user.email
        const name = user.username
        //get the name list of the participants
        const participantsList = await getParticipants(event.participants)

        // create the notification text
        const emailText = `Dear ${name},\n\nYou have deleted the following Event:\n\n`+
        `Event Name: ${event.eventName}\n\n`+
        `Start Time: ${momentTimezone(event.startTime).tz(event.timezone).format(timeFormat)} (${event.timezone})\n\n`+
        `End Time: ${momentTimezone(event.endTime).tz(event.timezone).format(timeFormat)} (${event.timezone})\n\n`+
        `Participants: ${participantsList.join(", ")}\n\n`+
        `Description: ${event.description}\n\n`+
        `Location: ${event.location}`
        
        sendEmail(`Personal CRM : Notification for Deleting "${event.eventName}"`, emailText, email)
        return res.send(emailText)

    } catch (err) { // error occured
        res.status(400);
        return res.send("Event deletion failed");
    }
}

// send notification to notify the result of editing an event
const notificationEdit = async (req, res) => {
    try {
        const timeFormat = "DD/MM/YY, hh:mm a"
        // store the event from the request body and the user details
        const oldEvent = req.body.oldEvent
        const newEvent = req.body.newEvent
        const user = await getUser(req.session.userId)
        //get the name list of the participants
        const participantsList = await getParticipants(event.participants)
        const email = user.email
        const name = user.username

        // Create the notification text
        const emailText = `Dear ${name},\n\nYou have edited the following Event:\n\n`+
        `Event Name: ${oldEvent.eventName}\n\n`+
        `Start Time: ${momentTimezone(oldEvent.startTime).tz(oldEvent.timezone).format(timeFormat)} (${oldEvent.timezone})\n\n`+
        `End Time: ${momentTimezone(oldEvent.endTime).tz(oldEvent.timezone).format(timeFormat)} (${oldEvent.timezone})\n\n`+
        `Participants: ${participantsList.join(", ")}\n\n`+
        `Description: ${oldEvent.description}\n\n`+
        `Location: ${oldEvent.location}\n\n\n\n` +
        `The newly edited Event has the following details:\n\n`+
        `Event Name: ${newEvent.eventName}\n\n`+
        `Start Time: ${momentTimezone(newEvent.startTime).tz(newEvent.timezone).format(timeFormat)} (${newEvent.timezone})\n\n`+
        `End Time: ${momentTimezone(newEvent.endTime).tz(newEvent.timezone).format(timeFormat)} (${newEvent.timezone})\n\n`+
        `Participants: ${participantsList.join(", ")}\n\n`+
        `Description: ${newEvent.description}\n\n`+
        `Location: ${newEvent.location}`

        sendEmail(`Personal CRM : Notification for Updating "${oldEvent.eventName}"`, emailText, email)
        return res.send(emailText)
        
    } catch (err) { // error occured
        res.status(400);
        return res.send("Error in sending notification");
    }
}

const periodicCheck = async() => {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const timeFormat = "DD/MM/YY, hh:mm a"

    // get all events in the allocated timerange(today, tomorrow)
    const events = await Events.find({startTime: {
        $gt: today,
        $lt: tomorrow
    }, isEmailed: 'false'}).lean()

    if(events.length > 0){
        events.forEach( async (event) => {
        //get the user's Email and username
        const user = await getUser(event.userId)
        const email = user.email
        const name = user.username
    
        //get the name list of the participants
        const participantsList = await getParticipants(event.participants)
    
        
        // Create the notification text
        const emailText = `Dear ${name},\n\nYou have an Upcoming Event:\n\n`+
        `Event Name: ${event.eventName}\n\n`+
        `Start Time: ${momentTimezone(event.startTime).tz(event.timezone).format(timeFormat)} (${event.timezone})\n\n`+
        `End Time: ${momentTimezone(event.endTime).tz(event.timezone).format(timeFormat)} (${event.timezone})\n\n`+
        `Participants: ${participantsList.join(", ")}\n\n`+
        `Description: ${event.description}\n\n`+
        `Location: ${event.location}`

        sendEmail(`Personal CRM : Notification for Upcoming "${event.eventName}"`, emailText, email)

        await Events.findOneAndUpdate({_id: objectId(event._id)}, {isEmailed: true})
    
        })
    }
}

// send email to the user
const sendEmail = (subject, emailText, userEmail) => {
    //create nodemailer transporter with provided credentials
    var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "developers.personalcrm@gmail.com",
            pass: "devel-opers_crm"
        }
    });

    // email to the user
    const mailOptions = {
        from: "developers.personalcrm@outlook.com",
        to: userEmail,
        subject: subject,
        text: emailText
    }

    transporter.sendMail(mailOptions, async function(err, data) {
        if (err) {
            console.log("Error " + err);
        } else {
            console.log("Email sent successfully");
        }
    });

}

module.exports = {
  notificationEdit, notificationDelete, periodicCheck
};
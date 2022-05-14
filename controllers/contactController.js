// import contact model
const Contact = require('../models/contact');
const User = require('../models/users');
const Department = require('../models/department');
const Organisation = require('../models/organisation');

// turn string into objectId
const objectId = require('mongodb').ObjectID;

// get all contacts
const getAllContacts = async (req, res) => {
    try {
        console.log(req.session.userId);
        const contacts = await Contact.find({'userId': req.session.userId}).lean();
        // const contacts = await Contact.find({'userId': objectId('6123be502afc875770f07ef9')}).lean();
        return res.send(contacts);
    } catch (err) { // error occured
        res.status(400);
        return res.send("Database query failed");
    }
};

// find one contact by their id
const getOneContact = async (req, res) => {
    try {
        const oneContact = await Contact.findOne({"_id": req.params.id}).lean();
        if (oneContact === null) {  // no contact found in database
            res.status(404);
            return res.send("Contact not found");
        }
        return res.send(oneContact);
    } catch (err) { // error occured
        res.status(400);
        return res.send("Database query failed");
    }
};

const getOneProfile = async (req, res) => {
    try {
        console.log(req.body)
        const oneContact = await User.findById({"_id": req.session.userId}).lean();
        // const oneContact = await User.findById({"_id": objectId('6123be502afc875770f07ef9')}).lean();
        if (oneContact === null) {  // no contact found in database
            res.status(404);
            return res.send("Contact not found");
        }
        console.log(oneContact)
        return res.send(oneContact);
    } catch (err) { // error occured
        res.status(400);
        return res.send("Database query failed");
    }

};

// add a contact (POST)
const createContact = async (req, res) => {
    // get the data sent from the frontend
    const { contactName, phoneHome, phoneWork, phoneMobile, email, contactLabel, departmentName, organisationName, description } = req.body;
    // check if a department with that name exist
    const department = await Department.findOne({departmentName: departmentName}).lean()
    let departmentId = ""
    // if it exist, just take the id
    if (department !== null) {
        departmentId = objectId(department._id);
    } else { // it doesn't exist so create a new department with that name and save it to the database
        const newDepartment = new Department({departmentName: departmentName, userId : req.session.userId});
        await newDepartment.save();
        departmentId = objectId(newDepartment._id);
    }
    // check if an organisation with that name exist
    const organisation = await Organisation.findOne({nameLower: organisationName.toLowerCase()}).lean()
    let organisationId = ""
    // if it exist, just take the id
    if (organisation !== null) {
        organisationId = objectId(organisation._id);
    } else { // it doesn't exist so create a new organisation with that name and save it to the database
        const newOrganisation = new Organisation({orgName: organisationName, nameLower: organisationName.toLowerCase(), userId : req.session.userId});
        await newOrganisation.save();
        organisationId = objectId(newOrganisation._id);
    }
    // save the contact info
    const contactInfo = {
        contactName: contactName,
        phoneNumbers: {
            home: phoneHome,
            work: phoneWork,
            mobile: phoneMobile
        },
        email: email,
        label: contactLabel,
        departmentId: departmentId,
        organisationId: organisationId,
        description: description,
        dateCreated: new Date(),
        userId: req.session.userId
        // userId: objectId('6123be502afc875770f07ef9')
    }
    // create a new contact based on the info
    const contact = new Contact(contactInfo);

    try { // save the new contact to the database
        let result = await contact.save();
        return res.send(result);
    } catch (err) { // error occured
        res.status(400);
        return res.send("Database insert failed");
    }
};

// update a contact (POST)
const editContact = async (req, res) => {
    // get the data sent from the frontend
    const { _id, contactName, phoneHome, phoneWork, phoneMobile, email, contactLabel, departmentName, organisationName, description } = req.body;
    // check if a department with that name exist
    const department = await Department.findOne({departmentName: departmentName}).lean()
    let departmentId = ""
    // if it exist, just take the id
    if (department !== null) {
        departmentId = objectId(department._id);
    } else { // it doesn't exist so create a new department with that name and save it to the database
        const newDepartment = new Department({departmentName: departmentName});
        await newDepartment.save();
        departmentId = objectId(newDepartment._id);
    }
    // check if an organisation with that name exist
    const organisation = await Organisation.findOne({nameLower: organisationName.toLowerCase()}).lean()
    let organisationId = ""
    // if it exist, just take the id
    if (organisation !== null) {
        organisationId = objectId(organisation._id);
    } else { // it doesn't exist so create a new organisation with that name and save it to the database
        const newOrganisation = new Organisation({orgName: organisationName, nameLower: organisationName.toLowerCase()});
        await newOrganisation.save();
        organisationId = objectId(newOrganisation._id);
    }
    // save the contact info
    const contactInfo = {
        contactName: contactName,
        phoneNumbers: {
            home: phoneHome,
            work: phoneWork,
            mobile: phoneMobile
        },
        email: email,
        label: contactLabel,
        departmentId: departmentId,
        organisationId: organisationId,
        description: description,
        dateCreated: new Date(),
        userId: req.session.userId
        // userId: objectId('6123be502afc875770f07ef9')
    }

    try {
        const contact = await Contact.findOne({"_id": objectId(_id)});
        if (!contact) { // if contact is not already in database, return an error
            res.status(400);
            return res.send("Contact not found in database");
        }

        Object.assign(contact, contactInfo); // replace properties that are listed in the POST body
        let result = await contact.save();  // save update contact to database
        return res.send(result);            // return saved contact to sender
    } catch (err) { // error detected
        res.status(400);
        return res.send("Database update failed");
    }
};

// delete a contact (DELETE)
const deleteContact = async (req, res) => {
    try { // delete contact based on the given id
        const id = req.params.id;
        await Contact.deleteOne({"_id": objectId(id)}, (err, result) => {});
        return res.send("Contact successfully deleted");
    } catch (err) { // error detected
        res.status(400);
        return res.send("Database delete failed");
    }
};

module.exports = {
    getOneContact, getAllContacts, createContact, editContact, deleteContact, getOneProfile
};
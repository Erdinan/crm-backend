const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    contactName: {
        type: String,
        required: true
    },
    phoneNumbers: {
        type: Object,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    label: {
        type: String
    },
    departmentId: {
        type: mongoose.Schema.Types.ObjectId
    },
    organisationId: {
        type: mongoose.Schema.Types.ObjectId
    },
    description: {
        type: String
    },
    dateCreated: {
        type: Date
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId
    }
}, { versionKey: false , timestamps: false });

const Contact = mongoose.model("Contact", contactSchema);

module.exports = Contact;
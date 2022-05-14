const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    eventName: {
        type: String
    },
    startTime: {
        type: Date
    },
    endTime: {
        type: Date
    },
    description: {
        type: String
    },
    location: {
        type: String
    },
    participants: {
        type: Array,
        default: void 0
    },
    dateAdded: {
        type: Date
    },
    timezone: {
        type: String
    },
    isEmailed: {
        type: Boolean
    }
}, { versionKey: false , timestamps: false });

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
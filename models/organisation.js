const mongoose = require('mongoose');

const organisationSchema = new mongoose.Schema({
    orgName : {
        type : String,
        required : true,
        unique : true
    },
    nameLower : {
        type: String,
        required : true,
        unique : true
    },
    size : {
        type: Number
    },
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'user'
    }
});

const Organisation = mongoose.model("Organisation", organisationSchema);


module.exports = Organisation;
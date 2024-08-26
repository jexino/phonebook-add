const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    email: {
        type: String,
        default: ''
    },
    firstName: {
        type: String,
        default: ''
    },
    lastName: {
        type: String,
        default: ''
    },
    phone: {
        type: String,
        required: true
    },
});
var contact= new mongoose.model('Contact', schema);
module.exports = contact;

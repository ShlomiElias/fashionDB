var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// create a schema
var adminSchema = new Schema({
    adminName: {
        type: String,
        required: true
    },
    adminPassword: {
        type: String,
        required: true
    }
});


module.exports = mongoose.model('admin', adminSchema, 'admins');

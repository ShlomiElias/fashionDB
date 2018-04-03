var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var productSchema = new Schema({
    category: {
        type: String
    },
    src: {
        type: String
    },
    name: {
        type: String
    },
    brand: {
        type: String
    },
    price: {
        type: Number
    }
});

module.exports = mongoose.model('product', productSchema, 'products');

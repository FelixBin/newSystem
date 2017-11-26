var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var productSchema = new Schema({
    "productId": {type: String},
    "producName": String,
    "salePrice": Number,
    "productImage": String

});
module.exports = mongoose.model("Good", productSchema, 'goods');
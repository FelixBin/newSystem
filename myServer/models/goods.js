var mongoose = require('mongoose');
var productSchema= require('../schemas/goods');
module.exports = mongoose.model("Good", productSchema, 'goods');
var mongoose = require('mongoose');
var userSchema=require('../schemas/users')
/*commonjs规范*/
module.exports = mongoose.model("User", userSchema, 'users')

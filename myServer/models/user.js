var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    "userId": String,
    "userName": String,
    "userPwd": String,
    "orderList": Array,
    "cartList": [
        {
            "productId":String,
            "producName": String,
            "salePrice":Number,
            "productName": String,
            "productImage": String,
            "checked": String,
            "productNum": String
        }
    ],
    "addressList": Array
});
module.exports = mongoose.model("User", userSchema, 'users')
/*commonjs规范*/
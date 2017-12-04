var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    "userId": String,
    "userName": String,
    "userPwd": String,
    "orderList": [{
        orderId: '',
        orderTotal: '',
        addressInfo: '',
        goodsList: [],
        orderStatus: '',
        createDate: ''
    }],
    "cartList": [
        {
            "productId": String,
            "producName": String,
            "salePrice": Number,
            "productName": String,
            "productImage": String,
            "checked": String,
            "productNum": String
        }
    ],
    "addressList": [
        {
            "addressId": String,
            "userName": String,
            "streetName": String,
            "postCode": Number,
            "tel": Number,
            "isDefault": Boolean
        }
    ]
});
/*commonjs规范*/
module.exports = mongoose.model("User", userSchema, 'users')

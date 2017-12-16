var mogoose = require('mongoose');
//商品表结构
module.exports=new mogoose.Schema({
    "productId": {type: String},
    "producName": String,
    "salePrice": Number,
    "productImage": String
})
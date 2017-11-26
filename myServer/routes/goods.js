var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Goods = require('../models/goods');
var User = require('../models/user');

//连接mongodb数据库
mongoose.connect('mongodb://localhost:27018/newSystem', {useMongoClient: true});
mongoose.connection.on("connected", function () {
    console.log("链接成功")
    /* var goos=new Goods({
     "productId":'01',
     "producName": "细末",
     "salePrice":123,
     "productImage":''
     })
     goos.save();
     */
    /* var user = new User({
     "userId": "1007",
     "userName": '',
     "userPwd": '',
     "orderList": [],
     "cartList": [
     {
     "productId":"01",
     "producName": "huwei",
     "salePrice":50,
     "productImage": String,
     "checked": "1",
     "productNum": ''
     }
     ],
     "addressList": []
     })
     user.save();*/
});
mongoose.connection.on("error", function () {
    console.log("失败")
});
mongoose.connection.on("disconnected", function () {
    console.log("断开")
});

//查询商品列表
router.get('/list', function (req, res, next) {
    //配置运行跨域

    //limit :显示的数量
    // skip：忽略的数量
    //1：1-2  skip:0 （当前页-1）*limit
    //2:3-4  skip:2
    let sort = parseInt(req.query.sortPrice);
    let page = parseInt(req.query.page);
    let limit = parseInt(req.query.pageSize);
    let skip = (page - 1) * limit;
    let params = {};
    let priceLevel = req.query.priceLevel;
    var priceGet = '', priceLtte = '';
    if (priceLevel != 'all') {
        switch (priceLevel) {
            case '0':
                priceGet = 0;
                priceLtte = 100;
                break;
            case '1':
                priceGet = 100;
                priceLtte = 500;
                break;
            case '2':
                priceGet = 500;
                priceLtte = 1000;
                break;
            case '3':
                priceGet = 1000;
                priceLtte = 5000;
                break;
        }
        params = {
            salePrice: {
                $gt: priceGet,
                $lte: priceLtte
            }
        }
    }

    let goodsModel = Goods.find(params).skip(skip).limit(limit);
    //非sql 需使用对象形式
    goodsModel.sort({'salePrice': sort});
    goodsModel.exec(function (err, doc) {
        if (err) {
            res.json({
                status: 1,
                msg: err.message
            })
        } else {
            res.json({
                status: 0,
                msg: '',
                result: {
                    count: doc.length,
                    list: doc
                }
            })
        }
    })
});
//加入购物车
router.post("/addCart", function (req, res, next) {
    var userId = "1007";
    var productId = req.body.productId;
    User.findOne({
        userId: userId
    }, function (err, userDoc) {
        if (err) {
            return res.json({
                status: "1",
                msg: err.message
            })
        } else {
            if (userDoc) {//用户存在
                let goodsItem = '';
                userDoc.cartList.forEach(function (item) {
                    if (item.productId == productId) {
                        goodsItem = item;
                        item.productNum++;
                    }
                });
                if (goodsItem) {
                    userDoc.save(function (err2, doc2) {
                        if (err2) {
                            return res.json({
                                status: "1",
                                msg: err2.message
                            })
                        } else {
                            return res.json({
                                status: "0",
                                msg: '',
                                result: "suc"
                            })
                        }
                    })
                } else {
                    Goods.findOne({
                        productId: productId
                    }, function (err1, doc) {
                        var newobj = null;
                        if (err1) {
                            return res.json({
                                status: "1",
                                msg: err1.message
                            })
                        } else {
                            if (doc) {//商品
                                newobj = {//新创建一个对象，实现转换mongoose不能直接增加属性的坑
                                    productNum: "1",
                                    checked: "1",
                                    productId: doc.productId,
                                    producName: doc.producName,
                                    salePrice: doc.salePrice,
                                    productName: doc.productName,
                                    productImage: doc.productImage,
                                }
                                userDoc.cartList.push(newobj);
                                userDoc.save(function (err2) {
                                    if (err2) {
                                        return res.json({
                                            status: "1",
                                            msg: err2.message
                                        })
                                    } else {
                                        return res.json({
                                            status: "0",
                                            msg: '',
                                            result: "suc"
                                        })
                                    }
                                })
                            }
                        }
                    })
                }
            }
        }
    })
});
module.exports = router;




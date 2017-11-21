var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Goods = require('../models/goods');

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

    var user = new Users({
        "userId": "1007",
        "userName": '',
        "userPwd": '',
        "orderList": [],
        "cartList": [
            {
                "productId": "02",
                "productName": '',
                "salePrict": '',
                "productImage": '',
                "checked": '',
                "productNum": ''
            }
        ],
        "addressList": []
    })
    user.save();
     */
});
mongoose.connection.on("error", function () {
    console.log("失败")
});
mongoose.connection.on("disconnected", function () {
    console.log("断开")
});

//查询商品列表
router.get('/', function (req, res, next) {
    //配置运行跨域
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Headers', 'Content-Type');

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
router.post("/addCart",function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    var userId = "1007";
    var productId = req.body.productId;
    var User = require('../models/user');
    User.findOne({
        userId: userId
    }, function (err,userDoc) {
        if (err) {
            console.log("err的值:"+err)
         return   res.json({
                status: "1",
                msg: err.message
            })
        } else {
         res.json({
                status: 0,
                msg: ''
            })
         if (userDoc) {//用户存在
                Goods.findOne({
                    productId: productId
                }, function (err1, doc) {
                    console.log("doc是否存在:"+doc)
                    if (err1) {
                       return res.json({
                            status: "1",
                            msg: err1.message
                        })
                    } else {
                        if (doc) {//商品
                            console.log("商品是否存在："+doc)
                            doc.productNum = 1;
                            doc.checked = 1;
                            userDoc.cartList.push(doc);
                            userDoc.save(function (err2, doc2) {

                                if (err2) {
                                 return   res.json({
                                        status: "1",
                                        msg: err2.message
                                    })
                                } else {
                               return     res.json({
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
   })
});

module.exports = router;




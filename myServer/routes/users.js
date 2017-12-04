var express = require('express');
var router = express.Router();
require("./../util/util.js");
var User = require("./../models/user");
/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});
//登录
router.post('/login', function (req, res, next) {
    var param = {
        userName: req.body.userName,
        userPwd: req.body.userPwd,
    };

    User.findOne(param, function (err, userDoc) {
        if (err) {
            res.json({
                status: "1",
                msg: err.message
            })
        } else {
            if (userDoc) {
                //cookie
                res.cookie("userId", userDoc.userId, {
                    path: '/',
                    maxAge: 1000 * 60 * 60
                });
                //用户名
                res.cookie("userName", userDoc.userName, {
                    path: '/',
                    maxAge: 1000 * 60 * 60
                });
                //session
                /*  req.session["user"] = userDoc;*/
                res.json({
                    status: "0",
                    msg: '',
                    result: {//登录成功返回的数据
                        userName: userDoc.userName
                    }
                })
            }
        }
    })
});
//注销
router.post('/logout', function (req, res, next) {
    res.cookie('userId', '', {
        maxAge: -1
    });
    res.json({
        status: "0",
        msg: '',
        result: ''
    })
});

//检查是否登录
router.get('/checkLogin', function (req, res, next) {
    if (req.cookies.userId) {
        res.json({
            status: "0",
            msg: '',
            result: req.cookies.userName || ''
        })
    } else {
        res.json({
            status: "1",
            msg: "未登录",
            result: ''
        })
    }
});

//购物车列表
router.get("/cartList", function (req, res, next) {
    var userId = req.cookies.userId;
    User.findOne({userId: userId}, function (err, doc) {
        if (err) {
            res.json({
                status: "1",
                msg: err.message,
                result: ''
            })
        } else {
            if (doc) {
                res.json({
                    status: '0',
                    msg: '',
                    result: doc.cartList
                })
            }
        }
    })
});
//购物车删除
router.post("/cartDel", function (req, res, next) {
    var userId = req.cookies.userId;
    var productId = req.body.productId;
    User.update(
        {
            userId: userId//查询到该用户
        },
        {
            $pull: {//删除该商品
                'cartList': {'productId': productId}
            }
        }, function (err, doc) {
            if (err) {
                res.json({
                    status: "1",
                    msg: err.message,
                    result: ''
                })
            } else {
                if (doc) {
                    res.json({
                        status: "0",
                        msg: '',
                        result: 'suc'
                    })
                }
            }
        })
});
//增加/减少  修改商品数量
router.post("/cartEdit", function (req, res, next) {
    var userId = req.cookies.userId;
    var productId = req.body.productId;
    var productNum = req.body.productNum;
    var checked = req.body.checked;
    //改变子文档  update方法
    User.update({//查询
        "userId": userId,
        "cartList.productId": productId
    }, {//修改的目标
        "cartList.$.productNum": productNum,
        "cartList.$.checked": checked,
    }, function (err, doc) {
        if (err) {
            res.json({
                status: "1",
                msg: err.message,
                result: ''
            })
        } else {
            if (doc) {
                res.json({
                    status: "0",
                    msg: '',
                    result: 'suc'
                })
            }
        }
    })
});
//全选
router.post("/editCheckAll", function (req, res, next) {
    var userId = req.body.userId;
    var checkAll = req.body.checkAll ? '1' : '0';
    User.findOne({userId: userId}, function (err, user) {
        if (err) {
            res.json({
                status: "1",
                msg: err.message,
                result: ''
            })
        } else {
            if (user) {
                user.cartList.forEach(() => {
                    item.checked = checkAll;
                });
                user.save(function (err1, doc) {
                    if (err1) {
                        res.json({
                            status: "1",
                            msg: err1.message,
                            result: ''
                        })
                    } else {
                        res.json({
                            status: "0",
                            msg: '',
                            result: 'suc'
                        })
                    }
                });
                res.json({
                    status: "0",
                    msg: '',
                    result: 'scu'
                })
            }
        }
    })
});
//获取当前用户的地址列表
router.get('/addressList', function (req, res, next) {
    var userId = req.cookies.userId;
    User.findOne({userId: userId}, function (err, doc) {
        if (err) {
            res.json({
                status: "1",
                msg: err.message,
                result: ''
            });
        } else {
            res.json({
                status: "0",
                msg: '',
                result: doc.addressList
            })
        }
    })
});

//设置默认地址接口
router.post('/setDefaultAddress', function (req, res, next) {
    var userId = req.cookies.userId;
    var addressId = req.body.addressId;
    var index = req.body.index;
    if (!addressId) {
        res.json({
            status: '1003',
            msg: 'addressId is null',
            result: ''
        });
    } else {
        User.findOne({userId: userId}, function (err, doc) {
            if (err) {
                res.json({
                    status: '1',
                    msg: err.message,
                    result: ''
                })
            } else {
                var addressList = doc.addressList;
                addressList.forEach((item) => {
                    if (item.addressId == addressId) {
                        item.isDefault = true;
                    } else {
                        item.isDefault = false;
                    }
                });
                doc.save(function (err1, doc1) {
                    if (err1) {
                        res.json({
                            status: '1',
                            msg: err1.message,
                            result: ''
                        })
                    } else {
                        res.json({
                            status: '0',
                            msg: '',
                            result: index
                        })
                    }
                })
            }
        })
    }
});
//删除地址
router.post('/delAddress', function (req, res, next) {
    var userId = req.cookies.userId;
    var addressId = req.body.addressId;
    User.update({
        userId: userId
    }, {
        $pull: {//删除某个的某个（具体的）
            'addressList': {
                'addressId': addressId
            }
        }
    }, function (err, doc) {
        if (err) {
            res.json({
                status: '1',
                msg: err.message,
                result: ''
            })
        } else {
            res.json({
                status: '0',
                msg: '',
                result: ''
            })
        }
    })
});

//订单生成
router.post('/payMent', function (req, res, next) {
    var userId = req.cookies.userId,
        orderTotal = req.body.orderTotal,
        addressId = req.body.addressId;
    User.findOne({userId: userId}, function (err, doc) {
        if (err) {
            res.json({
                status: '1',
                msg: err.message,
                result: ''
            })
        } else {
            var address = '';
            var goodsList = [];
            //获取当前用户的地址信息
            doc.addressList.forEach((item) => {
                if (addressId == item.addressId) {
                    address = item;
                }
            });
            //获取当前购物车的购买商品
            doc.cartList.filter((item) => {
                if (item.checked == "1") {
                    goodsList.push(item);
                }
            });
//时间+orderId
            var platform = '622';//当前系统的自定义数子
            var r1 = Math.floor(Math.random() * 10);
            var r2 = Math.floor(Math.random() * 10);
            var sysDate = new Date().Format('yyyyMMddhhmmss');
            var createDate = new Date().Format('yyyy-MM-dd hh:mm:ss')
            var orderId = platform + r1 + sysDate + r2;//21位数字

            //订单对象
            var order = {
                orderId: orderId,
                orderTotal: orderTotal,
                addressInfo: address,
                goodsList: goodsList,
                orderStatus: '1',
                createDate: createDate
            };
            doc.orderList.push(order);

            doc.save(function (err1, doc1) {
                if (err1) {
                    res.json({
                        status: '1',
                        msg: err1.message,
                        result: ''
                    })
                } else {
                    res.json({
                        status: '0',
                        msg: '',
                        result: {
                            orderId: '',
                            orderTotal: ''
                        }
                    })
                }
            });
            res.json({
                status: '0',
                msg: '',
                result: {
                    orderId: order.orderId,
                    orderTotal: order.orderTotal
                }
            })
        }
    })
})
module.exports = router;

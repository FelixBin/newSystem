var express = require('express');
var router = express.Router();
var User = require("./../models/user");
/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});
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
    User.findOnd({userId: userId}, function (err, user) {
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
})
module.exports = router;

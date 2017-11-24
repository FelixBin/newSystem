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
//刷新保持
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
})
module.exports = router;
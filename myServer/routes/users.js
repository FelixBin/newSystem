var express = require('express');
var router = express.Router();
var User = require("./../models/user");
/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

router.post('/login', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Headers', 'Content-Type');
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
})
module.exports = router;

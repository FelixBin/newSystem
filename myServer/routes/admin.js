var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('admin/index', { title: '登录' });
});
module.exports = router;

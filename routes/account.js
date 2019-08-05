var express = require('express')
var router = express.Router()
var mongoose = require('mongoose')
var Account = require('../moudels/account')

//链接MongoDB 数据库
mongoose.connect('mongodb://127.0.0.1:27017/runoob')

mongoose.connection.on('connected', function () {
	console.log('MongoDB success')
})
mongoose.connection.on('error', function () {
	console.log('MongoDB fail')
})

router.get('/', function (req, res, next) {
	var imgUrl = req.param('imgUrl')
	var money = req.param('money')
	var year = req.param('year')
	var month = req.param('month')
	var day =  req.param('day')
	var status = req.param('status')
	var remark = req.param('remark')
	var title = req.param('title')
	var openid = req.param('openid')
	Account.create({
		'title': title,
		'money': money,
		'imgUrl': imgUrl,
    'year': year,
    'month': month,
    'day': day,
		'remark': remark,
		'status': status, // 0支出 1收入
		'openid': openid,
		'addTime': new Date().getTime()
	}, 
	function (err, doc) {
		if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else { 
      res.json({
        code: '200',
      })
    }
	})
})
router.get('/find', function (req, res, next) {
	var openid = req.param('openid')
	var year = req.param('year')
	var month = req.param('month')
	Account.find({'openid': openid,'month':month,'year':year},function(err,doc){
		res.json({
			code: 200,
			list: doc
		})
	}).sort({'addTime':-1})
})

router.get('/detail', function (req, res, next) {
	var openid = req.param('openid')
	var orderId = req.param('orderId')
	Account.find({'openid': openid,'_id':orderId},function(err,doc){
		res.json({
			code: 200,
			list: doc
		})
	})
})

router.get('/all', function (req, res, next) {
	var openid = req.param('openid')
	Account.find({'openid': openid},function(err,doc){
		res.json({
			code: 200,
			list: doc
		})
	})
})
router.get('/update', function (req, res, next) {
	var imgUrl = req.param('imgUrl')
	var money = req.param('money')
	var year = req.param('year')
	var month = req.param('month')
	var day =  req.param('day')
	var status = req.param('status')
	var remark = req.param('remark')
	var title = req.param('title')
	var openid = req.param('openid')
	var orderId = req.param('orderId')
	Account.update({
		'_id': orderId,
		'openid': openid
	},{
		'title': title,
		'money': money,
		'imgUrl': imgUrl,
    'year': year,
    'month': month,
    'day': day,
		'remark': remark,
		'status': status, // 0支出 1收入
	},
	function(err, doc) {
		if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      res.json({
				code: '200'
      })
    }
	});
});
module.exports = router;
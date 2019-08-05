var express = require('express')
var router = express.Router()
var mongoose = require('mongoose')
var Money = require('../moudels/money')


//链接MongoDB 数据库
mongoose.connect('mongodb://127.0.0.1:27017/runoob')

mongoose.connection.on('connected', function () {
	console.log('MongoDB success')
})
mongoose.connection.on('error', function () {
	console.log('MongoDB fail')
})
router.get('/submit', function (req, res, next) {
	var openid = req.param('openid')
	Money.findOne({
		openid: openid
	},function(err,doc) {
		Money.create({
			openid: openid,
			integral: parseInt(doc.integral) + 100 ,
			access: 1,
			increase: 100,
			addTime: new Date().getTime()
		},function(error,data){
			res.json({
				code: 200,
				data: data
			})
		})
	}).sort({"addTime":-1}).limit(1)

})
router.get('/record', function (req, res, next) {
	var openid = req.param('openid')
	Money.find({
		openid: openid
	},function(err,doc) {
		res.json({
			code: 200,
			data: doc
		})
	})
})
module.exports = router;
var express = require('express')
var router = express.Router()
var mongoose = require('mongoose')
var Sign = require('../moudels/sign')
var Money = require('../moudels/money')

//链接MongoDB 数据库
mongoose.connect('mongodb://127.0.0.1:27017/runoob')

mongoose.connection.on('connected', function () {
	console.log('MongoDB success')
})
mongoose.connection.on('error', function () {
	console.log('MongoDB fail')
})

router.get('/info', function (req, res, next) { //添加签到
	var openid = req.param('openid')
	var increase = req.param('increase')
	// if(openid && increase) {
		Sign.findOne({openid: openid},(err,doc) => {
			if(err) {
				res.json({
					status: '1',
					msg: err.message
				})
			} else {
				let date = new Date()
				let year = date.getFullYear()
				let month = date.getMonth() + 1
				let day = date.getDate()
	
				let d1 = new Date(year+'/'+month+'/'+day).getTime() //现在
				if(doc) {
					let d2 = doc.addTime //以前
					let iday = parseInt(d1-d2)/1000/60/60/24
	
					if(iday == 1) {
						doc.addUp = parseInt(doc.addUp) + 1
						if(parseInt(doc.continuous) <= 7 ) {
							doc.signDay = parseInt(doc.signDay) +1
							iday == 1? ( doc.continuous = parseInt(doc.continuous) + 1) : doc.continuous = 1
						} else {
							doc.continuous = 1
							doc.signDay = 1
						}
						doc.integral = parseInt(doc.integral ) + parseInt(increase )
						Sign.create({
							'openid': doc.openid,
							'continuous': doc.continuous, //连续
							'addTime': d1,
							'addUp': doc.addUp, //累计
							'integral': doc.integral,//金额总量
							'increase': increase, //增加的金额
							'signDay': doc.signDay, //已签到的天数
							'access': 0, //获取金额类型 1问卷 0 签到
							'isSign': 1 //1 已经签到 0没有签到
						},function(error,docs){
							// 添加金额
							Money.create({
								openid: openid,
								integral: docs.integral,
								access: 0, // 0 签到 1 问卷,
								addTime: new Date().getTime(),
								increase: parseInt(increase)
							})
							res.json({
								msg: '签到成功',
								code: 200,
								data: docs
							})
						})
					} else if(iday > 1) {
						Sign.create({
							'openid': openid,
							'continuous': '1', //连续
							'addTime': d1,
							'addUp': parseInt(doc.addUp) +1, //累计
							'integral': parseInt(doc.integral)+1,//金额总量
							'increase': '1', //增加的金额,
							'signDay': '1', //已签到的天数,
							'access': 0, //获取金额类型 1问卷 0 签到
							'isSign': 1 //1 已经签到 0没有签到
						},function(error,data){
							// 添加金额
							Money.create({
								openid: openid,
								integral: doc.integral,
								access: 0, // 0 签到 1 问卷,
								addTime: new Date().getTime(),
								increase: parseInt(increase)
							})
							res.json({
								msg: '创建成功',
								code: 200,
								data: data
							})
						})
					}	else {
						res.json({
							msg: '今天已签到',
							code: 304
						})
					}
				} else {
					Sign.create({
						'openid': openid,
						'continuous': '1', //连续
						'addTime': d1,
						'addUp': '1', //累计
						'integral': '1',//金额总量
						'increase': increase, //增加的金额,
						'signDay': '1', //已签到的天数,
						'access': 0, //获取金额类型 1问卷 0 签到
						'isSign': 1 //1 已经签到 0没有签到
					},function(error,data){
						// 添加金额
						Money.create({
							openid: openid,
							integral: doc.integral,
							access: 0, // 0 签到 1 问卷,
							addTime: new Date().getTime()
						})
						res.json({
							msg: '创建成功',
							code: 200,
							data: date
						})
					})
				}
			}
		}).sort({"addTime":-1}).limit(1)
	// }
})

router.get('/money',function(req, res, next){ //签到详情
	var openid = req.param('openid')

	Sign.findOne({openid: openid},function(err,doc){
		let date = new Date()
		let year = date.getFullYear()
		let month = date.getMonth() + 1
		let day = date.getDate()
		let d1 = new Date(year+'/'+month+'/'+day).getTime() //现在
		if(d1-doc.addTime > 86400000) {
			res.json({
				code: 200,
				msg:{
					'openid': openid,
					'continuous': '0', //连续
					'addUp': doc.addUp, //累计
					'integral': doc.integral,//金额总量
					'signDay': '0', //已签到的天数,
				}
			})
		} else {
			res.json({
				msg: doc,
				code: 200
			})			
		}

	}).sort({"addTime":-1}).limit(1)
})

module.exports = router;
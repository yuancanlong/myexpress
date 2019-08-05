var mongoose = require('mongoose')
var Schema = mongoose.Schema

var moneySchema = new Schema({
	openid: String,
	integral: String,
	access: Number,
	addTime: Number,
	increase: Number
})
module.exports = mongoose.model('money', moneySchema)
var mongoose = require('mongoose')
var Schema = mongoose.Schema
var accountSchema = new Schema({
    'title': String ,
    'money': String,
    'imgUrl': String,
    'year': String,
    'month': String,
    'day': String,
    'remark': String,
    'status': String, // 0支出 1收入
    'openid': String,
    'orderId': String,
    'addTime': Number
})
module.exports = mongoose.model('account',accountSchema)
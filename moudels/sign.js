var mongoose = require('mongoose')
var Schema = mongoose.Schema
var signSchema = new Schema({
    continuous: String,
    addTime: String,
    addUp: String,
    openid: String,
    integral: String,
    increase: String,
    signDay: String,
    access: Number,
    isSign: Number
})
module.exports = mongoose.model('sign',signSchema)
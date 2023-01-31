const mongoose = require('mongoose')
const Schema = mongoose.Schema

const commentsSchema = new Schema({
    author : {type : String, required : true},
    date : {type : Date, default : Date.now()},
    comment : {type : String, default : true},
    userId : {
        type : mongoose.Schema.Types.ObjectId, ref : 'User',required : true
    },
    EventId : {
        type : mongoose.Schema.Types.ObjectId, ref : 'Event',required : true
    }
})

const Comments = mongoose.model('Comments', commentsSchema)
module.exports = Comments
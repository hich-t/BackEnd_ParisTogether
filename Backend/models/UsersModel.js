const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const userSchema = new Schema({
    first_name:{type : String, required : true},
    last_name:{type : String, required : true},
    email:{type : String, required : true},
    password : {type : String, required : true, minLength : 5},
    confirm_password :{type : String, minLength : 5}
})


const User = mongoose.model('User', userSchema)

module.exports = User;
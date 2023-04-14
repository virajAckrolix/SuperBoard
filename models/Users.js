const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    fullName : {
        type : String,
        default : null,
        required : true
    },
    email: {
        type: String,
        required: true,
        default : null
    },
 
    password: {
        type: String,
        required: true
    },
    refreshToken: {type : String , default : null},
    
});

module.exports = mongoose.model('Users', userSchema);
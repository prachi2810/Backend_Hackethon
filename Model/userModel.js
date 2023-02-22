const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    
    email : {
        type: String,
        required : [true, "Please provide unique Email"],
        unique: true,
    },
    
    username : {
        type: String,
        required : [true, "Please provide unique Username"],
        unique: [true, "Username Exist"]
    },

    password : {
        type: String,
        required : [true, "Please provide a Password"],
        unique: false,
    }

});

module.exports = mongoose.model('usermodel',UserSchema);
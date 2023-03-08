const mongoose = require('mongoose')

const UserSchemaGoogle = new mongoose.Schema({
    
    email : {
        type: String,
        required : [true, "Please provide unique Email"],
        unique: true,
    },
    
    username : {
        type: String,
        required : [true, "Please provide unique Username"],
        unique: [true, "Username Exist"]
    }

 

});

module.exports = mongoose.model('usermodelGoogle',UserSchemaGoogle);
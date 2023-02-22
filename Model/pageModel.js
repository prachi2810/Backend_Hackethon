const mongoose=require('mongoose');

const Page=mongoose.Schema({

    name:{
        type:String,
        required:true,
        trim:true,
        maxlength:25
    },
    slug:{
        type:String,
        required:true,
    },
    content:Object

},{timestamp:true})

module.exports=mongoose.model('Pages',Page);
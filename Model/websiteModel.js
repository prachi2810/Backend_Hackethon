const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const websiteSchema = new Schema({
  html: { type: String },
  css: { type: Object },
  assets: { type: [String] },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  name: {
    type: String,
    trim: true,
    maxlength: 25
  },
  domain:{
    type:String,
  },
  date:{
    type:Date,
    default:Date.now(),
    trim: true
  }

});
module.exports = mongoose.model('Website', websiteSchema);

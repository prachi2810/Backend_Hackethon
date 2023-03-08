const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const templateSchema = new Schema({
  html: { type: String},
  css: { type: Object},
  assets: { type: [String] },
  userId:{
    type:mongoose.Schema.Types.ObjectId,
   },
   thumbnail: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'uploads.files'
  },
   name:String,
   domain:String
});
module.exports = mongoose.model('Template', templateSchema);

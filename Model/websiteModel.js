const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const websiteSchema = new Schema({
  html: { type: String},
  css: { type: Object},
  assets: { type: [String] },
  userId:{
    type:mongoose.Schema.Types.ObjectId,
}
});
module.exports = mongoose.model('Website', websiteSchema);

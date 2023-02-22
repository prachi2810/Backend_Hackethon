const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const websiteSchema = new Schema({
  html: { type: String},
  css: { type: Object},
  assets: { type: [String] },
});

module.exports = mongoose.model('Website', websiteSchema);

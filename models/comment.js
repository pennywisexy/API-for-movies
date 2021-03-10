const {Schema, model}  = require('mongoose');

const commentScheme = new Schema({
  text: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  }
}) 

module.exports = model('Comment', commentScheme)
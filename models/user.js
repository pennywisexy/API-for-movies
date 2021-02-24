const {Schema, model}  = require('mongoose');

const userScheme = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  'first-name': {
    type: String,
    required: true
  },
  'last-name': {
    type: String,
    required: true
  }
}) 

module.exports = model('User', userScheme)
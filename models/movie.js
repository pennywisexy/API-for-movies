const {Schema, model} = require('mongoose')

const movie = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  sources: [{
    type: String,
    required: true
  }],
  subtitle : {
    type: String,
    required: true
  },
  thumb: {
    type: String,
    required: true
  },
  ratingValue: {
    type: Number,
    required: true
  }
})

module.exports = model('Movie', movie)
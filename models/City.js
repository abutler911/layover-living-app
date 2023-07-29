const mongoose = require('mongoose')

const RecommendationSchema = new mongoose.Schema({
  placeName: String,
  type: String,
  address: String,
  description: String,
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
})

const CommentSchema = new mongoose.Schema({
  text: String,
  date: Date,
  madeBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
})

const CitySchema = new mongoose.Schema({
  name: String,
  country: String,
  state: String,
  recommendations: [RecommendationSchema],
  submittedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  favoriteCount: Number,
  comments: [CommentSchema],
  safetyRating: Number,
})

module.exports = mongoose.model('City', CitySchema)

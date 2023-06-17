const mongoose = require('mongoose');

// Define a separate schema for the image details
const imageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  alt: {
    type: String,
    required: true,
  },
});

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: imageSchema,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Movie', movieSchema);

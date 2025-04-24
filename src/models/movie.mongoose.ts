import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const MovieSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => uuidv4()
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  releaseDate: {
    type: Date,
    required: true
  },
  genre: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 10
  },
  imdbId: {
    type: String,
    required: true
  },
  director: {
    type: String,
    required: true
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export const MovieModel = mongoose.model('Movie', MovieSchema);
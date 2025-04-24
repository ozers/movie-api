import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const DirectorSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => uuidv4()
  },
  firstName: {
    type: String,
    required: true,
    minlength: 2
  },
  lastName: {
    type: String,
    required: true,
    minlength: 2
  },
  birthDate: {
    type: String,
    required: true,
    match: /^\d{4}-\d{2}-\d{2}$/
  },
  bio: {
    type: String,
    required: true,
    maxlength: 500
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export const DirectorModel = mongoose.model('Director', DirectorSchema);
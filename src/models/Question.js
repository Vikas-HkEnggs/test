// src/models/Question.js
import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: String,
    default: 'Teacher',
  },
});

export default mongoose.models.Question || mongoose.model('Question', QuestionSchema);
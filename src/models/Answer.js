// models/Answer.js
import mongoose from 'mongoose';

const AnswerSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Question',
  },
  answerText: {
    type: String,
    required: true,
  },
  answeredBy: {
    type: String,
    required: true,
  },
  answeredAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Answer || mongoose.model('Answer', AnswerSchema);
import mongoose from 'mongoose';
import { fa } from 'zod/v4/locales';

const questionResultSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'question',
  },
  lessonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
    required: true,
  },
  lesson: { type: String, required: true },
  sentence: { type: String, required: true },
  question: { type: String, required: true },
  studentAnswer: { type: String, required: true },
  totalQuestions: {
    type: Number,
    required: false,
  },
  evaluationResult: { type: String },

  correctAnswers: {
    type: Number,
    required: false,
  },
  wrongAnswers: {
    type: Number,
    required: false,
  },
  feedback:{type:String },
   submittedAt: {
    type: Date,
    default: Date.now },
}, { timestamps: true });


export const QuestionResultModel = mongoose.model('QuestionResult', questionResultSchema);



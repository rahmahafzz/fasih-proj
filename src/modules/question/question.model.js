import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  lessonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
    required: true,
  },
  type: {
    type: String,
    enum: ['mcq', 'fill-in-the-blank', 'true-false'],
    required: false,
  },
  lesson: { type: String, required: true },
  prompt: {
    type: String,
    required: true,
  },
  questionText: {
    type: String,
    required: true,
  },
  options: [String], // Only required for MCQ
  correctAnswer: {
    type: mongoose.Schema.Types.Mixed,
    required: false,
  },
  explanation: {
    type: String,
  },
}, { timestamps: true });

export const QuestionModel = mongoose.model('Question', questionSchema);

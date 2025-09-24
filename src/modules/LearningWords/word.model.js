import mongoose from 'mongoose';

const wordSchema = new mongoose.Schema({
  arabic: [
  {
    lessonName: { type: String, required: true },
    favourite: { type: String },
    studied: { type: String  }
  }
]
  // {
  //   type: String,
  //   trim: true
  // },
  ,english: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    enum: ['learned', 'favorite'],
    default: 'learned'
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastReviewed: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

wordSchema.index({ userId: 1, category: 1 });
wordSchema.index({ arabic: 'text', english: 'text' });

export default mongoose.model('Word', wordSchema);

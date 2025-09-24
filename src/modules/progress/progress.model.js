import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  lessonId: {
    type: mongoose.Schema.Types.Mixed,
    ref: 'Lesson',
    required: false,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  date: {
     type: Date, 
     default: Date.now 
  },
  completedAt: {
    type: Date, 
  },
  streak: {
    type: Number
  },
  lastStreakDate: {
    type: Date,
  },
  videosWatched: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }],

  type: {
  type: String,
  enum: ['lesson', 'streak'],
  default: 'lesson',
},

}, { timestamps: true });

progressSchema.index(
  { userId: 1, type: 1, completedAt: 1 }, { unique: true, partialFilterExpression: { type: 'streak' } },
  { userId: 1, lessonId: 1 }, { unique: true, partialFilterExpression: { lessonId: { $ne: null } } }
);



export const ProgressModel = mongoose.models.Progress || mongoose.model('Progress', progressSchema);


import mongoose from 'mongoose';

const calendarSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  date: {
    type: Date,
    required: true,
  },
  activityType: {
    type: String,
    enum: ['lesson', 'quiz', 'review'],
    required: true,
  },
}, {
  timestamps: true,
  versionKey: false,
});

calendarSchema.index({ userId: 1, date: 1 }, { unique: true });

export const CalendarModel = mongoose.model('Calendar', calendarSchema);

import mongoose from 'mongoose';

const levelSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  order: {
    type: Number,
    required: true,
    unique: true,
  },
  description: {
    type: String,
  },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    }
}, { timestamps: true });

export const LevelModel = mongoose.model('Level', levelSchema);

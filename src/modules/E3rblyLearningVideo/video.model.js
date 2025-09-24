import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },

  rule: { type: String },

  videoUrl: { type: String, required: true },

  lesson: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', required: true },
  
  order: { type: Number, default: 1 }

}, { timestamps: true });

export const VideoModel = mongoose.models.Video || mongoose.model('Video', videoSchema);

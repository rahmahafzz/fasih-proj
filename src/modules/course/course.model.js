import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    image: { type: String },
    isPublished: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const CourseModel = mongoose.model('Course', courseSchema);

import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true }
}, {
  timestamps: true
});

categorySchema.virtual('posts', {
  ref: 'Post',
  localField: '_id',
  foreignField: 'category'
});

categorySchema.set('toObject', { virtuals: true });
categorySchema.set('toJSON', { virtuals: true });

export const CommunityCategoryModel = mongoose.model('CommunityCategory', categorySchema);



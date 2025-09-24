import mongoose from 'mongoose';

const unitSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  levelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Level',
    required: true
  },
  order: { type: Number, default: 0 }
}, { timestamps: true });

export const UnitModel = mongoose.model('Unit', unitSchema);

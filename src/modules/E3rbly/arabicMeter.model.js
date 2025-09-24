import mongoose from 'mongoose';

const arabicMeterSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
    },
    predictedMeter: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const ArabicMeterModel = mongoose.model('ArabicMeter', arabicMeterSchema);

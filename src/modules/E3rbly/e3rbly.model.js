import mongoose from 'mongoose';


const grammarItemSchema = new mongoose.Schema({
  word: String,
  type: String,
  state: String,
  root: String
}, { _id: false });

const i3rabSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
  type: {
    type: String,
    enum: ['poetry', 'morphology', 'plural', 'antonyms', 'synonyms'],
    required: true,
  },
  inputText: {
    type: String,
    required: true,
  },
  generated_poem: {
    type: mongoose.Schema.Types.Mixed
  },
  // sequence_length: Number,
    grammarResult: [grammarItemSchema], 
  meaningSchema: {
    type: mongoose.Schema.Types.Mixed
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const I3rabModel = mongoose.model('I3rab', i3rabSchema);


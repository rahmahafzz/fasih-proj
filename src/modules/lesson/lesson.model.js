import mongoose, { Schema } from 'mongoose';


// const flashcardSchema = new mongoose.Schema({
//   word: { type: String, required: false },
//   favourite: { type: String, required: false },
//   studied: { type: String }, 
// });

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  unitId: { type: mongoose.Schema.Types.ObjectId ,
    ref: 'Unit' },
  levelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Level'
  },
  order: { type: Number, default: 0 },
  flashcards: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Word',
  }
]
  // [flashcardSchema]
  ,
  content: {
     type: new Schema({
    text: { type: String },
     }),
  },
  wordle: [String],
  videoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video',
    required: true,
  },
  isPublished: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export const LessonModel = mongoose.models.Lesson || mongoose.model('Lesson', lessonSchema);


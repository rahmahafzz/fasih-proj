import { z } from 'zod';
import mongoose from 'mongoose';

const objectIdValidator = z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
  message: 'معرف غير صالح',
});


export const flashcardSchema = z.object({
  lessonName: z.string().min(1 ,'الكلمة مطلوبة'),
  favourite: z.string().min(1),
  studied: z.string(),
});

export const addFlashcardsSchema = z.object({
  lessonId: z.string().length(24), // MongoDB ObjectId
  flashcards: z.array(flashcardSchema),
});

export const createLessonSchema = z.object({
  title: z.string().min(1, 'العنوان مطلوب'),
  description: z.string(),
  content: z.object({
  text: z.string().min(3)}),
  levelId: objectIdValidator,
  unitId: objectIdValidator,
  order: z.number().optional(),
  flashcards: objectIdValidator.array().optional(),
  wordle: z.array(z.string()).optional(),
  videoId: objectIdValidator,
  isPublished: z.boolean().optional()
});




export const updateLessonSchema = createLessonSchema.partial();



// "title": "الدرس الرابع ",
//   "description": "تعلم الحروف",
//   "lessonId":"687ebed8945bce313a734602",
//   "levelId": "687ed76c3bc21b47e7cb0da1",
//   "unitId": "687ed8453bc21b47e7cb0dad",
//   "videoId": "688595a759b0e52a77995c0d",
//   "flashcards": [
    
//     {
//       "word": "فرح",
//       "favourite": "Book",
//       "studied": "فرح تحب القراءة "
//     },
//     {
//       "word": "سعادة",
//       "favourite": "happiness",
//       "studied":"هذا الولد سعيد ب قراءة الكتب  "
//     }

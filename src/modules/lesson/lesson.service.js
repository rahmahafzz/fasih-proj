import { LessonModel } from './lesson.model.js';
import AppError from '../../utils/appError.js';
import Word from '../LearningWords/word.model.js';

export const createLesson = async (lessonData, createdBy) => {
  return await LessonModel.create({
    ...lessonData,
    createdBy // injected from req.user
  });
};

export const addFlashcardsToLesson = async ({ lessonId, flashcards }) => {
  const lesson = await LessonModel.findById(lessonId);
  if (!lesson) throw new AppError('محتوى الدرس غير موجود', 404);
  const newWord = await Word.create({
  arabic: flashcards
});
lesson.flashcards.push(newWord);
 await lesson.save();
  return lesson.flashcards;
};

export const getLessonWithFlashcards = async (lessonId) => {
  const lesson = await LessonModel.findById(lessonId).populate('flashcards');
  if (!lesson) throw new AppError('محتوى الدرس غير موجود', 404);

  let flashcards = lesson.flashcards;

  // لو مش موجودة، نستخرجها يدويًا ثم نحفظها
  if (!flashcards || flashcards.length === 0) {
    const contentText = lesson.content?.text || lesson.description || lesson.title || '';
    flashcards = extractFlashcardsFromText(contentText);

    // حفظها في قاعدة البيانات مرة واحدة
    lesson.flashcards = flashcards;
    await lesson.save();
  }

  return { lesson, flashcards };
};

// دالة استخراج ذكية من النص
function extractFlashcardsFromText(text) {
  // if (!text) return [];

  // إزالة التشكيل والأحرف الزائدة
  const cleanText = text
    .replace(/[\u064B-\u0652]/g, '') // Remove Arabic diacritics
    .replace(/[^\u0621-\u064A\s]/g, ''); // Remove non-Arabic letters

  const allWords = cleanText.split(/\s+/);

  // قائمة الكلمات الشائعة التي يتم تجاهلها
  const stopwords = new Set([
    'من', 'في', 'عن', 'على', 'إلى', 'مع', 'أن', 'إن', 'كان', 'ما', 'لا',
    'لم', 'لن', 'قد', 'هذا', 'هذه', 'ذلك', 'تلك', 'هو', 'هي', 'هم', 'هن',
    'أنا', 'أنت', 'أنتم', 'نحن', 'ثم', 'بعد', 'قبل', 'كل', 'بعض', 'أي','التي'
  ]);

  // تصفية الكلمات
  const filtered = allWords.filter(
    (word) => word.length > 2 && !stopwords.has(word)
  );

  // إرجاع أول 5 كلمات فريدة كفلاش كاردز
  return [...new Set(filtered)].map(word => ({
  front: word,
  back: '' // أو ترجمة تلقائية إذا كانت متاحة فى فريق الفلاتر
})).slice(0, 5);
}

export const getAllLessons = async () => {
  return await LessonModel.find().populate('videoId');
};

export const getLessonById = async (id) => {
  const lesson = await LessonModel.findById(id).populate('videoId');
  if (!lesson) throw new AppError('الدرس غير موجود', 404);
  return lesson;
};

export const updateLesson = async (lessonId, updateData) => {
  return await LessonModel.findByIdAndUpdate(lessonId, updateData, {
    new: true,
    runValidators: true,
  });
};

export const deleteLesson = async (lessonId) => {
  return await LessonModel.findByIdAndDelete(lessonId);
};

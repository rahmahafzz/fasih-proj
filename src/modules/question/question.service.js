import { QuestionModel } from './question.model.js';
import { QuestionResultModel } from './questionResult.model.js';
import { evaluateAnswer } from './quiz.controller.js';
import axios from 'axios';
import AppError from '../../utils/appError.js';


const ALLOWED_LESSONS = [
  "اسم التفضيل", "اسم الزمان واسم المكان", "اسم الفاعل", "اسم المرة",
  "اسم المفعول", "اسم الهيئة", "الاسم المقصور", "الاسم الممدود",
  "الاسم المنقوص", "المصادر الصريحة", "المصدر الصناعي",
  "المصدر المؤول", "المصدر الميمي", "صيغ المبالغة", "نائب الفاعل"
];

export const generateAIQuestion = async (lessonName,lessonId) => {
  if (!ALLOWED_LESSONS.includes(lessonName)) {
    throw new AppError('اسم الدرس غير مسموح به أو غير مدعوم', 400);
  }
  const lessonIdfind = await QuestionModel.find({ lessonId});
  const response = await axios.post(
    'https://malak-hossam-generate-questions.hf.space/analyze',
    { lesson: lessonName , lessonId: lessonId },
    { headers: { 'Content-Type': 'application/json' } }
  );

  const { prompt_used, generated_question } = response.data;

  if (!prompt_used || !generated_question || generated_question.includes('❌')) {
    throw new AppError('فشل في توليد السؤال من الداتا سيت ', 400);
  }

  const newQuestion = await QuestionModel.create({
    lesson: lessonName,
    lessonId: lessonId,
    prompt: prompt_used,
    questionText: generated_question,
    isAI: true,
    choices: [], // أو null حسب التصميم
    correctAnswer: null // لأنه سيتم تقييمه لاحقًا من المستخدم
  });

  return newQuestion;
};

export const getQuestionsByLesson = async (lessonId) => {
  return await QuestionModel.find({ lessonId });
};

export const getQuestionById = async (id) => {
  const q = await QuestionModel.findById(id);
  if (!q) throw new AppError('Question not found', 404);
  return q;
};

export const deleteQuestion = async (id) => {
  const q = await QuestionModel.findByIdAndDelete(id);
  if (!q) throw new AppError('Question not found', 404);
  return "Question deleted";
};

export const submitAnswer = async (userId, questionId, userAnswer) => {
  const question = await QuestionModel.findById(questionId);
  if (!question) throw new Error('Question not found');

  let isCorrect = false;
  let score = 0;
  let feedback = '';

  if (question.useAI) {
    const evaluation = await evaluateAnswer({
      question: question.content,
      answer: userAnswer,
    });

    isCorrect = evaluation.isCorrect;
    feedback = evaluation.feedback;
  } else {
    switch (question.type) {
      case 'mcq':
        if (Array.isArray(userAnswer)) {
          isCorrect = JSON.stringify(userAnswer.sort()) === JSON.stringify(question.correctAnswer.sort());
        } else {
          isCorrect = userAnswer === question.correctAnswer;
        }
        break;
      case 'fill-in-the-blank':
        isCorrect = typeof userAnswer === 'string' &&
          userAnswer.trim().toLowerCase() === String(question.correctAnswer).trim().toLowerCase();
        break;
      case 'true-false':
        isCorrect = userAnswer === question.correctAnswer;
        break;
      default:
        throw new Error('Unknown question type');
    }
    feedback = isCorrect ? 'Correct answer!' : (question.explanation || 'Incorrect answer.');
  }

  score = isCorrect ? 1 : 0;

  const result = await QuestionResultModel.create({
    userId,
    questionId,
    userAnswer,
    isCorrect,
    score,
    feedback,
  });

  return { isCorrect, score, feedback, result };
};

import { QuestionModel } from './question.model.js';
import { QuestionResultModel } from './questionResult.model.js';
import axios from 'axios';
import AppError from '../../utils/appError.js';
import { markLessonComplete } from "../progress/progress.service.js";

export const submitQuiz = async ({ userId, lessonId, submittedAnswers }) => {
  
  if (!Array.isArray(submittedAnswers) || submittedAnswers.length !== 3) {
    throw new Error('يجب إرسال 3 إجابات فقط.');
  }

  const questionResultIds = submittedAnswers.map(a => a.questionResultId);

  const questionResults = await QuestionResultModel.find({
    _id: { $in: questionResultIds },
    lessonId
  });
  if (questionResults.length !== 3) {
    throw new Error('بعض الإجابات غير موجودة أو لا تخص هذا المستخدم/الدرس.');
  }

  const allCorrect = questionResults.every(q =>
    q.evaluationResult?.trim() === '-  صحيحة.'
  );

  if (allCorrect) {
    await markLessonComplete(userId, lessonId);
  }
const progress = await markLessonComplete(userId, lessonId);

  return {
    submitted: true,
    progress: progress,
    passed: allCorrect,
    message: allCorrect
      ? 'تم اجتياز الاختبار بنجاح '
      : 'تم إرسال الاختبار، ولكن هناك إجابات خاطئة.'
  };
};
export const evaluateAnswerService = async ({ lesson, sentence, question, student_answer , lessonId }) => {
  
  if (!lesson || !sentence || !question || !student_answer) {
    throw new AppError('جميع الحقول مطلوبة.', 400);
  }

  try {
    const lessonIdfind = await QuestionModel.find({ lessonId});
    const { data } = await axios.post('https://malak-hossam-evaluate-questions.hf.space/evaluate', {
      lesson,
      sentence,
      question,
      student_answer
    });
   
    if (!data.evaluation_result || !data.feedback) {
      console.error("AI Response:", data)
      throw new AppError('الرد غير مكتمل.', 502);
    }
  const resultDoc = await QuestionResultModel.create({
      lesson,
      lessonId:lessonId,
      sentence,
      question,
      studentAnswer: student_answer,
      evaluationResult: data.evaluation_result,
      feedback: data.feedback
    });

    return {
      evaluation_result: data.evaluation_result,
      feedback: data.feedback
    };
  } catch (error) {
    console.error('AI Evaluation Error:', error?.response?.data || error.message);
    throw new AppError('فشل في تقييم الإجابة. حاول مرة أخرى لاحقًا.', 500);
  }
};
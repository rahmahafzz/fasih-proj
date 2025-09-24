import * as questionService from './question.service.js';
import catchAsync from '../../utils/catchAsync.js';
import { createQuestionSchema, submitAnswerSchema } from './question.validation.js';


export const generateQuestionController = catchAsync(async (req, res) => {
  const { lessonName, lessonId } = req.body;
  if (!lessonName || !lessonId) {
    return res.status(400).json({ message: 'يرجى إرسال اسم الدرس' });
  }

  const question = await questionService.generateAIQuestion(lessonName, lessonId);

  res.status(201).json({
    status: 'success',
    data: {
      questionId: question._id,
      questionText: question.questionText,
      prompt: question.prompt
    }
  });
});

export const getById = catchAsync(async (req, res, next) => {
  const question = await questionService.getQuestionById(req.params.id);
  res.status(200).json({ status: 'success', data: question });
});

export const remove = catchAsync(async (req, res ) => {
  await questionService.deleteQuestion(req.params.id);
  res.status(200).json({ status: 'success' ,message: 'Question deleted successfully', data: null });
});

export const getLessonQuestions = catchAsync(async (req, res, next) => {
  const { lessonId } = req.params;
  const questions = await questionService.getQuestionsByLesson(lessonId);
  res.status(200).json({ status: 'success', data: questions });
});

export const submitAnswer = catchAsync(async (req, res, next) => {
 
  const { questionId, userAnswer } = submitAnswerSchema.parse(req.body);
  const userId = req.user._id;
  const result = await questionService.submitAnswer(userId, questionId, userAnswer);

  res.status(200).json({
    status: 'success',
    message: 'Answer submitted and evaluated',
    data: result
  });
});


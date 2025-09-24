import catchAsync from '../../utils/catchAsync.js';
import * as quizService from './quiz.service.js';
import { markLessonComplete } from "../progress/progress.service.js";
import AppError from "../../utils/appError.js";


export const submitQuiz = async (req, res, next) => {
  try {
    const { lessonId, submittedAnswers } = req.body;

    if (!Array.isArray(submittedAnswers)) {
      return res.status(400).json({
        status: 'fail',
        message: 'submittedAnswers يجب أن يكون مصفوفة',
      });
    }

    const userId = req.user.id;
    const result = await quizService.submitQuiz({ userId, lessonId, submittedAnswers });

    res.status(200).json({
      status: 'success',
      message: result.message,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const evaluateAnswer = async (req, res, next) => {
  const { lessonId } = req.body;
  try {
    const result = await quizService.evaluateAnswerService(req.body, lessonId);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

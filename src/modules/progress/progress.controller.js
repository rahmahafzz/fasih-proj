import * as progressService from './progress.service.js';
import AppError from '../../utils/appError.js';
import { LessonModel } from '../lesson/lesson.model.js';
import { ProgressModel } from './progress.model.js';
import catchAsync from '../../utils/catchAsync.js';

export const completeLesson = catchAsync(async (req, res ) => {
  const userId = req.user._id;
  const { lessonId } = req.body;
  const progress = await progressService.markLessonComplete(userId, lessonId);

 res.status(200).json({ status: 'success', data: progress });
});

export const dailyCheckIn = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const progress = await progressService.checkInDaily(userId);

  res.status(200).json({ status: 'success', data: progress });
})


export const getProgressStats = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const stats = await progressService.getUserStats(userId);
  res.status(200).json({ status: 'success', data: stats });
});

export const getMyProgress = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const progress = await progressService.getUserProgress(userId);
  res.status(200).json({ status: 'success', data: progress });
});

export const getLessonProgress = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const { lessonId } = req.params;
  const progress = await progressService.getLessonProgressById(userId, lessonId);
  res.status(200).json({ status: 'success', data: progress });
});


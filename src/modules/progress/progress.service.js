import { ProgressModel } from './progress.model.js';
import dayjs from 'dayjs';
import AppError from '../../utils/appError.js';
import mongoose from 'mongoose';

export const markLessonComplete = async (userId, lessonId) => {
  const existing = await ProgressModel.findOne({ userId, lessonId });
  const now = new Date();
  const today = dayjs().startOf('day');

  if (existing) {
    // تم إكمال الدرس سابقًا
    return existing;
  }

  let streak = 1;
  const lastStreak = await ProgressModel
    .findOne({ userId, type: 'streak' })
    .sort({ completedAt: -1 });

  if (lastStreak) {
    const lastStreakDate = dayjs(lastStreak.completedAt).startOf('day');
    const diffDays = today.diff(lastStreakDate, 'day');

    if (diffDays === 1) {
      streak = lastStreak.streak + 1;
    } else if (diffDays > 1) {
      streak = 1; // reset streak if missed more than one day
    } else {
      streak = lastStreak.streak; // same day or future date, keep streak
    }
  }

  // Create lesson completion record
   const completedLesson =await ProgressModel.create({
    userId,
    lessonId,
    isCompleted: true,
    completedAt: now,
    streak,
    lastStreakDate: today.toDate(),
    type: 'lesson',
  });

  // Ensure streak is marked once per day
  const alreadyCheckedInToday = await ProgressModel.findOne({
    userId,
    type: 'streak',
    lastStreakDate: today.toDate(),
  });

  if (!alreadyCheckedInToday) {
    await ProgressModel.create({
      userId,
      type: 'streak',
      isCompleted: false,
      completedAt: now,
      lastStreakDate: today.toDate(),
      streak,
    });
  }

return { message: 'Lesson completed and streak updated', completedLesson };
};


export const checkInDaily = async (userId) => {
  const today = dayjs().startOf('day');
  const dailyStreakId = new mongoose.Types.ObjectId(); // Generate a unique ObjectId for today's streak
  
  const latest = await ProgressModel.findOne({ userId, type: 'streak' }).sort({ completedAt: -1 });
  let streak = 1;
  
  if (latest) {
    const lastStreakDate = dayjs(latest.completedAt).startOf('day');
    const diffDays = today.diff(lastStreakDate, 'day');
    
    if (diffDays === 1) {
      streak = latest.streak + 1;
    } else if (diffDays > 1) {
      streak = 1;
    } else {
      streak = latest.streak;
    }
  }
  
  const exists = await ProgressModel.findOne({
    userId,
    type: 'streak',
    completedAt: {
      $gte: today.toDate(),
      $lt: dayjs(today).add(1, 'day').toDate(),
    },
  });
  
  if (exists) {
    throw new AppError('تم تسجيل الدخول بالفعل لهذا اليوم', 400);
  }
  
  return await ProgressModel.create({
    userId,
    type: 'streak',
    lessonId: dailyStreakId, // Unique ObjectId for each daily check-in
    isCompleted: true,
    completedAt: new Date(),
    streak,
    lastStreakDate: today.toDate(),
  });
};

export const getUserStats = async (userId) => {
  const all = await ProgressModel.find({ userId });
  const completed = all.filter(p => p.isCompleted).length;

  const sorted = all.sort((a, b) => b.streak - a.streak);
  const highestStreak = sorted[0]?.streak || 0;

  const lastActive = sorted[0]?.completedAt || null;

  return {
    completedLessons: completed,
    highestStreak,
    lastActive,
  };
};



export const getUserProgress = async (userId) => {
  return await ProgressModel.find({ userId });
};

export const getLessonProgressById = async (userId, lessonId) => {
  return await ProgressModel.findOne({ userId, lessonId });
};

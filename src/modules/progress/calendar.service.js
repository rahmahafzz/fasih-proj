import { ProgressModel } from '../progress/progress.model.js';
import { CalendarModel } from './calendar.model.js';

export const addCalendarEntry = async (entryData) => {
  return await CalendarModel.create(entryData);
};

export const getUserCalendar = async (userId, year, month) => {
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0, 23, 59, 59);

  const progressRecords = await ProgressModel.find({
    userId,
    date: { $gte: start, $lte: end },
    isCompleted: true
  });

  const activeDays = progressRecords.map(record => record.date.getDate());
  return [...new Set(activeDays)];
};
export const calculateUserStreak = async (userId) => {
  const logs = await CalendarModel.find({ userId }).sort({ date: 1 });

  let streak = 0;
  let lastDate = null;

  for (const log of logs) {
    const currentDate = new Date(log.date).setHours(0, 0, 0, 0);
    if (!lastDate) {
      streak = 1;
    } else {
      const diff = (currentDate - lastDate) / (1000 * 60 * 60 * 24);
      if (diff === 1) {
        streak++;
      } else if (diff > 1) {
        streak = 1;
      }
    }
    lastDate = currentDate;
  }

  return streak;
};


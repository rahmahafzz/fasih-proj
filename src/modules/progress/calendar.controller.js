import * as calendarService from './calendar.service.js';
import { addCalendarEntrySchema } from './calendar.validation.js';
import catchAsync from '../../utils/catchAsync.js';

export const addEntry = catchAsync(async (req, res) => {
  const validated = addCalendarEntrySchema.parse(req.body);
  const saved = await calendarService.addCalendarEntry(validated);
  res.status(201).json({ status: 'success', data: saved });
});

export const getCalendar = catchAsync(async (req, res) => {
  const { year, month } = req.params;
  const userId = req.user._id;

  const days = await calendarService.getUserCalendar(userId, year, month);

  res.status(200).json({
    status: 'success',
    month,
    year,
    activeDays: days
  });
});

export const getMyStreak = catchAsync(async (req, res) => {
  const streak = await calendarService.calculateUserStreak(req.user._id);
  res.status(200).json({ status: 'success', data: { streak } });
});


import { z } from 'zod';

export const addCalendarEntrySchema = z.object({
  userId: z.string().min(1),
  date: z.string().datetime({ offset: true }),
  activityType: z.enum(['lesson', 'quiz', 'review']),
});

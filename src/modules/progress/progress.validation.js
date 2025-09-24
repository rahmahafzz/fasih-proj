import { z } from 'zod';

export const markLessonCompleteSchema = z.object({
  lessonId: z.string().min(1),
});

export const checkInSchema = z.object({
  lessonId: z.string().min(1, "lessonId is required"),
});

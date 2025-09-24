import { z } from 'zod';

export const createCourseSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  image: z.string().url().optional(),
  isPublished: z.boolean().optional()
});

export const updateCourseSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  image: z.string().url().optional(),
  isPublished: z.boolean().optional()
});

export const courseIdSchema = z.object({
  id: z.string().min(1)
});


import { z } from 'zod';

export const createLevelSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  order: z.number().optional(),
  courseId: z.string().min(1),
});

export const updateLevelSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  order: z.number().optional(),
  courseId: z.string().min(1).optional(),
});

export const getLevelByIdSchema = z.object({
  id: z.string().min(1),
});

export const deleteLevelSchema = z.object({
  id: z.string().min(1),
});

export const getLevelsByUnitIdSchema = z.object({
  unitId: z.string().min(1),
});

export const getLevelsByCourseIdSchema = z.object({
  courseId: z.string().min(1),
});

import { z } from 'zod';

export const createUnitSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  levelId: z.string().min(1),
  order: z.number().optional()
});

export const updateUnitSchema = createUnitSchema.partial();

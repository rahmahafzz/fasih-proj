import { z } from 'zod';

export const createVideoSchema = z.object({
  title: z.string().min(2),
  rule: z.string().optional(),
  videoUrl: z.string().url(),
  lesson: z.string().length(24),
  order: z.number().optional()
});

import { z } from 'zod';
import mongoose from 'mongoose';

const isObjectId = z.string().refine(val => mongoose.Types.ObjectId.isValid(val), {
  message: 'Invalid ObjectId',
});

export const createQuestionSchema = z.object({
  lessonId: isObjectId,
  type: z.enum(['mcq', 'fill-in-the-blank', 'true-false']),
  questionText: z.string().min(3),
  options: z.array(z.string()).optional(),
  correctAnswer: z.any(),
  explanation: z.string().optional(),
});

export const getByLessonIdSchema = z.object({
  lessonId: z.string().min(1),
});

export const submitAnswerSchema = z.object({
  questionId: z.string().min(1),
  userAnswer: z.union([
    z.string(),
    z.boolean(),
    z.array(z.string()),
  ]),
});



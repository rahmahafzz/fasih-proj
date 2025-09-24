import express from 'express';
import * as controller from './progress.controller.js';
import  validate  from '../../middlewares/validate.js';
import { markLessonCompleteSchema , checkInSchema } from './progress.validation.js';
import { protect } from '../../middlewares/auth.middleware.js';

const router = express.Router();

router.post(
  '/complete',
  validate(markLessonCompleteSchema),
  controller.completeLesson
);

router.post(
  '/check-in', validate(checkInSchema),
  controller.dailyCheckIn
);

router.get(
  '/',
  controller.getMyProgress
);
router.get(
  '/streak-lessoncompleted-stats',
  controller.getProgressStats
);

router.get(
  '/:lessonId',
  controller.getLessonProgress
);

export default router;

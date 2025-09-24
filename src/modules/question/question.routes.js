import express from 'express';
import * as controller from './question.controller.js';
import  validate  from '../../middlewares/validate.js';
import { createQuestionSchema,getByLessonIdSchema, submitAnswerSchema } from './question.validation.js';
import { protect } from '../../middlewares/auth.middleware.js';
import { authorize } from '../../middlewares/role.middleware.js';

const router = express.Router();

router.post( '/',  controller.generateQuestionController);

router.get( '/lesson/:lessonId',validate(getByLessonIdSchema, 'params'), controller.getLessonQuestions);
router
  .route('/:id')
  .get( controller.getById)
  .delete( authorize('admin'), controller.remove);
// router.post('/submit-answer', protect, validate(submitAnswerSchema), controller.submitAnswer);

export default router;

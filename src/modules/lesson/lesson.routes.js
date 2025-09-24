import express from 'express';
import * as controller from './lesson.controller.js';
import { protect } from '../../middlewares/auth.middleware.js';
import validate from '../../middlewares/validate.js';
import { addFlashcardsSchema, createLessonSchema, updateLessonSchema } from './lesson.validation.js';
import { authorize } from '../../middlewares/role.middleware.js';

const router = express.Router();

// router.use(protect); // all routes are protected

router
  .route('/')
  .post(authorize('admin', 'vendor'), validate(createLessonSchema), controller.createLesson , controller.addFlashcards)
  .get( controller.getAllLessons);
  

router
  .route('/:id')
  .get(controller.getLessonById)
  .patch( authorize('admin', 'vendor'), validate(updateLessonSchema), controller.updateLesson)
  .delete( authorize('admin', 'vendor'), controller.deleteLesson);
router
  .get('/next/:lessonId', protect, controller.getNextLessonController)
  // .get('/:lessonId/words', protect, controller.getLessonWords)
  // .get('/:id/flashcards', protect, controller.getFlashcards)
  .post( '/:lessonId/flashcards', protect,validate(addFlashcardsSchema),controller.addFlashcards);
  // .get('/:id/details', controller.getLessonDetails);

export default router;

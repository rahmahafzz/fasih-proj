import express from 'express';
import * as controller from './course.controller.js';
import  validate  from '../../middlewares/validate.js';
import { protect } from '../../middlewares/auth.middleware.js';
import { authorize } from '../../middlewares/role.middleware.js';
import {
  createCourseSchema,
  updateCourseSchema,
  courseIdSchema
} from './course.validation.js';

const router = express.Router();

router
  .route('/')
  .get(controller.getAllCourses)
  .post(protect, authorize('admin', 'vendor'), validate(createCourseSchema), controller.createCourse);

router
  .route('/:id')
  .get(validate(courseIdSchema, 'params'), controller.getCourseById)
  .patch(protect, authorize('admin', 'vendor'), validate(updateCourseSchema), controller.updateCourse)
  .delete(protect, authorize('admin'), validate(courseIdSchema, 'params'), controller.deleteCourse);

export default router;
 


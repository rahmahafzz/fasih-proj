import express from 'express';
import * as controller from './unit.controller.js';
import validate from '../../middlewares/validate.js';
import { protect } from '../../middlewares/auth.middleware.js';
import { createUnitSchema, updateUnitSchema } from './unit.validation.js';

const router = express.Router();
router.use(protect); 
router
  .route('/')
  .get(controller.getAllUnits)
  .post(protect, validate(createUnitSchema), controller.createUnit);

router
  .route('/:id')
  .get(controller.getUnitById)
  .patch(protect, validate(updateUnitSchema), controller.updateUnit)
  .delete(protect, controller.deleteUnit);

export default router;

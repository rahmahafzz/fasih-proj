import express from 'express';
import * as controller from './level.controller.js';
import { protect } from '../../middlewares/auth.middleware.js';
import { authorize} from '../../middlewares/role.middleware.js';
import validate from '../../middlewares/validate.js';
import { createLevelSchema, updateLevelSchema ,getLevelByIdSchema,
  deleteLevelSchema, getLevelsByUnitIdSchema, getLevelsByCourseIdSchema} from './level.validation.js';

const router = express.Router();
 
router
  .route('/')
  .get(controller.getAllLevels)
  .post( authorize('admin', 'vendor'), validate(createLevelSchema), controller.createLevel);

router
  .route('/:id')
  .get(controller.getLevelById)
  .get(controller.getLevelsByCourseId)
  .get(controller.getLevelsByUnitId)
  .patch( authorize('admin', 'vendor'), validate(updateLevelSchema), controller.updateLevel)
  .delete( authorize('admin'), validate(deleteLevelSchema),  controller.deleteLevel);

export default router;

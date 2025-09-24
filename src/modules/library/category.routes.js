import express from 'express';
import * as catcontroller from './category.controller.js';
import { protect } from '../../middlewares/auth.middleware.js';
import { authorize } from '../../middlewares/role.middleware.js';

const router = express.Router();

router.get('/', catcontroller.getCategoriesController);
router.post('/', catcontroller.createCategoryController);
router.put('/:id', authorize('admin', 'vendor'),catcontroller.updateCategoryController);
router.delete('/:id',authorize('admin', 'vendor'), catcontroller.deleteCategoryController);


export default router;


import express from 'express';
import * as videoController from './video.controller.js';
import { protect } from '../../middlewares/auth.middleware.js';
import validate from '../../middlewares/validate.js';
import { authorize } from '../../middlewares/role.middleware.js';

const router = express.Router();

// Create new video (admin only)
router.post( '/', authorize('admin', 'vendor'), videoController.createVideoController);

router.post('/watch', videoController.watchVideoController);
// Get videos by lesson
router.get('/lesson/:lessonId', videoController.getVideosByLessonController);

export default router;

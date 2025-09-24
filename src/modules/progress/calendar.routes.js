import express from 'express';
import * as calendarController from './calendar.controller.js';
import { protect } from '../../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/:year/:month', calendarController.getCalendar);
router.post('/', calendarController.addEntry);
router.get('/streak', calendarController.getMyStreak);
export default router;
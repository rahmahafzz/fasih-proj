import express from 'express';
import * as quizController from './quiz.controller.js';
import { protect } from '../../middlewares/auth.middleware.js';


const router = express.Router();

router.post('/submit',  quizController.submitQuiz);
router.post('/evaluate',  quizController.evaluateAnswer);

export default router;

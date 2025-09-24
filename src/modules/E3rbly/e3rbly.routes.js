import express from 'express';
import * as controller from './e3rbly.controller.js';
import { protect } from '../../middlewares/auth.middleware.js';

const router = express.Router();

// router.use(protect);
router.post('/poetry' , controller.handleAiAnalysis); 
router.post('/morphology' , controller.handleMorphologyAnalysis);
router.post('/analyze-meaning' , controller.analyzeWordMeaning);
router.post('/arabic', controller.parseArabicSentence);
router.post('/predict-meter', controller.predictMeter );
router.get('/status', controller.getParsingStatus);
// router.get('/predicted-meter', controller.getUserMeterHistory);

export default router;


// {
//   "sentence": "الطائر يرفرف فى سلام",
//   "format": "structured"
// }
import express from 'express';
import {
  getWords,
  getWordsByCategory,
  createWord,
  updateWord,
  deleteWord,
  moveWordCategory,
  getVocabularyStats
} from './word.controller.js';
import { protect} from '../../middlewares/auth.middleware.js';
import {authorize} from '../../middlewares/role.middleware.js';

const router = express.Router();


router.use(protect);
// Main routes
router.route('/')
  .get(getWords);
  // .post(createWord);

router.get('/stats', getVocabularyStats);
router.get('/category/:category', getWordsByCategory);

router.route('/:id')
  .put(updateWord)
  .delete(deleteWord);

router.patch('/:id/move', moveWordCategory);

export default router;
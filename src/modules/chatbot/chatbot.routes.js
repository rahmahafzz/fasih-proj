import express from 'express';
import * as controller from './chatbot.controller.js';
import { protect } from '../../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/chat', controller.chatWithBot);

export default router;
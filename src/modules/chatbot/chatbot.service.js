import axios from 'axios';
import AppError from '../../utils/appError.js';
import { ChatModel } from './chatbot.model.js';
import { wordMeaningService } from '../E3rbly/e3rbly.service.js';



export const chatService = async ({ userId, message }) => {
  if (!userId || !message) throw new AppError('userId و message مطلوبين', 400);
  userId === "687bf0b7dd73b0c9a3c1f1b3"
  try {
    const response = await axios.post('https://malak-hossam-chat.hf.space/chat', {
      user_id: userId,
      message,
    }, {
      headers: { 'Content-Type': 'application/json' },
    });

    let aiReply = response.data?.response;

    if (!aiReply) throw new AppError('الرد غير موجود في البيانات المستلمة', 400);
   aiReply = aiReply
       .replace(/^•\s*/gm, '') // Remove existing bullets first
       .split(/(?<=[.؟!])\s+/)
       .filter(sentence => sentence.trim().length > 0)
       .map(sentence => sentence.trim())
       .map(sentence => `• ${sentence}`)
       .join('\n');

    // Save to DB
    await ChatModel.create({ userId, message, response: aiReply });
    
    return aiReply;

  } catch (error) {
    console.error('Chat API Error:', error?.response?.data || error.message);
    throw new AppError(error?.response?.data?.message || 'فشل في الاتصال بـ API الذكاء الاصطناعي', 500);
  }
};



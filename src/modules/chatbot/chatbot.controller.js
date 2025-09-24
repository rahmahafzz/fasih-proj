import catchAsync from '../../utils/catchAsync.js';
import { chatService } from './chatbot.service.js';

export const chatWithBot = catchAsync(async (req, res) => {
  const { userId, message } = req.body;
  const response = await chatService({ userId, message });

  res.status(200).json({
    status: 'success',
    response,
  });
});
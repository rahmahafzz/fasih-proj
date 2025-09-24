import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  message: { type: String, required: true },
  response: { type: String, required: true },
}, { timestamps: true });

export const ChatModel = mongoose.model('Chatbot', chatSchema);
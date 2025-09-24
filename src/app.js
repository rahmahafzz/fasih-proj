import express from 'express';
import authRoutes from './modules/Auth/auth.routes.js';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import globalErrorHandler from './middlewares/globalErrorHandler.js';
import lessonRoutes from './modules/lesson/lesson.routes.js';
import levelRoutes from './modules/level/level.routes.js';
import unitRoutes from './modules/unit/unit.routes.js';
import courseRoutes from './modules/course/course.routes.js';
import questionRoutes from './modules/question/question.routes.js';
import progressRoutes from './modules/progress/progress.routes.js';
import calenderRoutes from './modules/progress/calendar.routes.js';
import quizRoutes from './modules/question/quiz.routes.js';
import e3rblyRoutes from './modules/E3rbly/e3rbly.routes.js';
import videoRoutes from './modules/E3rblyLearningVideo/video.routes.js';
import chatbotRoutes from './modules/chatbot/chatbot.routes.js';
import userRoutes from './modules/User/user.routes.js';
import bookRoutes from './modules/library/book.routes.js';
import categoryRoutes from './modules/library/category.routes.js';
import learningWordRoutes from './modules/LearningWords/word.routes.js';
import communityRoutes from './modules/community/post.routes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.use(cookieParser());

const corsOptions = {
  origin: [
    'http://localhost:3000',           // Flutter web dev
    'http://localhost:8080',           // Flutter web dev alternative
    'https://*.ngrok-free.app',        // ngrok domains
    'https://*.ngrok.io',              // ngrok domains (older format)
  ],
  credentials: true,                   // Allow cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
};
// app.use(cors({
//   origin: true, // Allow all origins for development
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));

app.use(cors(corsOptions));
app.get('/', (req, res) => {
    res.send('Server is running');
});
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/lessons', lessonRoutes);
app.use('/api/v1/levels', levelRoutes);
app.use('/api/v1/units', unitRoutes);
app.use('/api/v1/courses', courseRoutes);
app.use('/api/v1/questions', questionRoutes);
app.use('/api/v1/progress', progressRoutes);
app.use('/api/v1/calendar', calenderRoutes);
app.use('/api/v1/quiz', quizRoutes);
app.use('/api/v1/e3rbly', e3rblyRoutes);
app.use('/api/v1/videos', videoRoutes);
app.use('/api/v1/chatbot', chatbotRoutes);
app.use('/api/v1/books', bookRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/learningwords', learningWordRoutes);
app.use('/api/v1/community/post', communityRoutes);
app.use(globalErrorHandler);


export default app;



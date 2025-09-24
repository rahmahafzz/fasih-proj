import { createVideoSchema } from './video.validation.js';
import * as videoService from './video.service.js';
import { LessonModel } from '../lesson/lesson.model.js';
import catchAsync from '../../utils/catchAsync.js';

export const createVideoController = async (req, res, next) => {
  try {
    const validatedData = createVideoSchema.parse(req.body);
    const newVideo = await videoService.createVideo(validatedData);
    
    res.status(201).json({
      status: 'success',
      data: newVideo
    });
  } catch (err) {
    next(err); // send to global error handler
  }
};

export const watchVideoController = catchAsync(async (req, res) => {
  const { videoId, lessonId } = req.body;
  const userId = req.user._id;

  const result = await videoService.watchVideo({ userId, videoId, lessonId });

  res.status(200).json({
    status: 'success',
    message: 'تم تسجيل مشاهدة الفيديو وتحديث التقدم',
    data: result,
  });
});
export const getVideosByLessonController = async (req, res, next) => {
  try {
    const { lessonId } = req.params;
    const lesson = await LessonModel.findById(lessonId);
    if (!lesson) {
      return res.status(404).json({
        status: 'error',
        message: 'الدرس غير موجود'
      });
    }
    const videos = await videoService.getVideosByLesson(lessonId);
    if (!videos || videos.length === 0) {
  return res.status(404).json({
    status: 'error',
    message: 'لا يوجد فيديوهات لهذا الدرس'
      });
    }
  res.status(200).json({
      status: 'success',
      lesson: {
        _id: lesson._id,
        title: lesson.title,
        description: lesson.description
      },
      results: videos.length,
      data: videos
    });
  } catch (error) {
    next(error);
  }
};
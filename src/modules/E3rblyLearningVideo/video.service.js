import { LessonModel } from '../lesson/lesson.model.js';
import { VideoModel } from './video.model.js';
import { ProgressModel } from '../progress/progress.model.js';
import AppError from '../../utils/appError.js';

export const createVideo = async (data) => {
  const { lesson } = data;

  const existingLesson = await LessonModel.findById(lesson);
  if (!existingLesson) {
    throw new AppError('الدرس غير موجود', 404);
  }

  const newVideo = await VideoModel.create(data);
  await LessonModel.findByIdAndUpdate(
    lesson, 
    { $set: { videoId: newVideo._id } }, 
    { new: true } 
  );
  return newVideo ;

};

export const watchVideo = async ({ userId, videoId, lessonId }) => {
  const video = await VideoModel.findById(videoId);
  if (!video) throw new AppError('الفيديو غير موجود', 404);

  const lesson = await LessonModel.findById(lessonId);
  if (!lesson) throw new AppError('الدرس غير موجود', 404);

  //  Log video watch progress
  let progress = await ProgressModel.findOne({ userId, lessonId });

  if (!progress) {
    progress = await ProgressModel.create({
      userId,
      lessonId,
      videosWatched: [videoId],
    });
  } else if (!progress.videosWatched.includes(videoId)) {
    progress.videosWatched.push(videoId);
    await progress.save();
  }

  //  If all lesson videos watched, mark as complete
  const allVideos = await VideoModel.find({ lessonId });
  const watchedCount = progress.videosWatched.length;

  if (watchedCount === allVideos.length) {
    progress.isCompleted = true;

    progress.completedAt = new Date();
    await progress.save();
  }

  return {
    isLessonCompleted: progress.isCompleted,
    streak: progress.streak,
    totalVideos: watchedCount,
    watchedVideos: progress.videosWatched.length,
  };
};


export const getVideosByLesson = async (lessonId) => {
  const lesson = await LessonModel.findById(lessonId);
  if (!lesson) throw new AppError('الدرس غير موجود', 404);

  const videos = await VideoModel.find({ lesson: lessonId }).sort({ order: 1 });

  return { lesson, videos };
};
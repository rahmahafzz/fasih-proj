import asyncHandler from 'express-async-handler';
import * as service from './lesson.service.js';
import  catchAsync from '../../utils/catchAsync.js';
import * as LessonValidation from './lesson.validation.js';

import AppError from '../../utils/appError.js';
import { LessonModel }  from './lesson.model.js';

export const createLesson = async (req, res, next) => {
  try {
    const lesson = await service.createLesson(req.body, req.user._id); //  pass createdBy
    res.status(201).json({ message: 'تم إنشاء الدرس بنجاح', data: lesson });
  } catch (err) {
    next(err);
  }
};

export const addFlashcards = catchAsync(async (req, res) => {
  const validated = LessonValidation.addFlashcardsSchema.parse(req.body);
  const newflashcard = await service.addFlashcardsToLesson(validated);

  res.status(201).json({ status: 'success', data: newflashcard});
});


export const getLessonDetails = catchAsync(async (req, res, next) => {
  const lessonId = req.params.id;
  const data = await service.getLessonWithFlashcards(lessonId);

  res.status(200).json({
    status: 'success',
    data,
  });
});


export const getAllLessons = asyncHandler(async (req, res) => {
  const lessons = await service.getAllLessons();
  res.status(200).json({ lessons });
});

export const getLessonById = asyncHandler(async (req, res) => {
  const lesson = await service.getLessonById(req.params.id);
  res.status(200).json({ lesson });
});
export const getNextLessonController = async (req, res, next) => {
  try {
    const { lessonId } = req.params;
    const current = await LessonModel.findById(lessonId);
    if (!current) throw new AppError('الدرس غير موجود', 404);

    const next = await LessonModel.findOne({
      unitId: current.unitId,
      order: { $gt: current.order },
    }).sort({ order: 1 });

    if (!next) {
      return res.status(200).json({ message: 'لا يوجد درس تالٍ', nextLesson: null });
    }

    res.status(200).json({ nextLesson: next });
  } catch (error) {
    next(error);
  }
};
export const updateLesson = async (req, res, next) => {
  try {
    const updatedLesson = await service.updateLesson(req.params.id, req.body);
    if (!updatedLesson) {
      return res.status(404).json({ message: 'الدرس غير موجود' });
    }
    res.status(200).json({ message: 'تم تحديث الدرس بنجاح', data: updatedLesson });
  } catch (err) {
    next(err);
  }
};


// export const getLessonWords = async (req, res, next) => {
//   try {
//     const lesson = await service.getLessonById(req.params.id);

//     // const lesson = await LessonModel.findById(lessonId);
//     console.log( lesson);
//     if (!lesson) {
//       throw new AppError('الدرس غير موجود', 404);
      
//     }

//     const flashcards = lesson.flashcards || [];
//     const wordle = lesson.wordle || [];

//     // Combine & remove duplicates
//     const words = [...new Set([...flashcards, ...wordle])];

//     res.status(200).json({
//       status: 'success',
//       data: words,
//     });
//   } catch (err) {
//     next(err);
//   }
// };

export const deleteLesson = async (req, res, next) => {
  try {
    const deleted = await service.deleteLesson(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'الدرس غير موجود أو تم حذفه مسبقًا' });
    }
    res.status(200).json({ message: 'تم حذف الدرس بنجاح' });
  } catch (err) {
    next(err);
  }
};

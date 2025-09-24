import { CourseModel } from './course.model.js';
import AppError from '../../utils/appError.js';

export const createCourse = async (data) => {
  return await CourseModel.create(data);
};

export const getAllCourses = async () => {
  return await CourseModel.find();
};

export const getCourseById = async (id) => {
  const course = await CourseModel.findById(id);
  if (!course) throw new AppError('الدورة غير موجودة', 404);
  return course;
};

export const updateCourse = async (id, data) => {
  const course = await CourseModel.findByIdAndUpdate(id, data, { new: true });
  if (!course) throw new AppError('تعذر تحديث الدورة', 404);
  return course;
};

export const deleteCourse = async (id) => {
  const course = await CourseModel.findByIdAndDelete(id);
  if (!course) throw new AppError('تعذر حذف الدورة', 404);
  return course;
};

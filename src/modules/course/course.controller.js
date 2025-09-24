import * as service from './course.service.js';

export const createCourse = async (req, res, next) => {
  try {
    const course = await service.createCourse(req.body);
    res.status(201).json(course);
  } catch (err) {
    next(err);
  }
};

export const getAllCourses = async (req, res, next) => {
  try {
    const courses = await service.getAllCourses();
    res.json(courses);
  } catch (err) {
    next(err);
  }
};

export const getCourseById = async (req, res, next) => {
  try {
    const course = await service.getCourseById(req.params.id);
    res.json(course);
  } catch (err) {
    next(err);
  }
};

export const updateCourse = async (req, res, next) => {
  try {
    const course = await service.updateCourse(req.params.id, req.body);
    res.json(course);
  } catch (err) {
    next(err);
  }
};

export const deleteCourse = async (req, res, next) => {
  try {
    const course = await service.deleteCourse(req.params.id);
    res.json({ message: 'تم حذف الدورة بنجاح', course });
  } catch (err) {
    next(err);
  }
};

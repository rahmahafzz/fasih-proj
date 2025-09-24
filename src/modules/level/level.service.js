import { LevelModel } from './level.model.js';
import AppError from '../../utils/appError.js';

export const createLevel = async (data) => {
  const exists = await LevelModel.findOne({ order: data.order });
  if (exists) throw new AppError('هذا المستوى موجود بالفعل', 400);
  return LevelModel.create(data);
};

export const getAllLevels = async () => {
  return LevelModel.find().sort({ order: 1 });
};

export const getLevelById = async (id) => {
  const level = await LevelModel.findById(id);
  if (!level) throw new AppError('المستوى غير موجود', 404);
  return level;
};

export const updateLevel = async (id, data) => {
  const level = await LevelModel.findByIdAndUpdate(id, data, { new: true });
  if (!level) throw new AppError('المستوى غير موجود', 404);
  return level;
};

export const deleteLevel = async (id) => {
  const level = await LevelModel.findByIdAndDelete(id);
  if (!level) throw new AppError('المستوى غير موجود', 404);
  return level;
};

export const getLevelsByCourseId = async (courseId) => {
  return await LevelModel.find({ courseId });
};

export const getLevelsByUnitId = async (unitId) => {
  return LevelModel.find({ unitId }).sort({ order: 1 });
};

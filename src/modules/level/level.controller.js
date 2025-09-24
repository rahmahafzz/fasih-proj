import * as service from './level.service.js';

export const createLevel = async (req, res, next) => {
  try {
    const level = await service.createLevel(req.body);
    res.status(201).json(level);
  } catch (err) {
    next(err);
  }
};

export const getAllLevels = async (req, res, next) => {
  try {
    const levels = await service.getAllLevels();
    res.json(levels);
  } catch (err) {
    next(err);
  }
};

export const getLevelById = async (req, res, next) => {
  try {
    const level = await service.getLevelById(req.params.id);
    res.json(level);
  } catch (err) {
    next(err);
  }
};

export const getLevelsByUnitId = async (req, res, next) => {
  try {
    const levels = await service.getLevelsByUnitId(req.params.unitId);
    res.json({ status: 'success', data: levels });
  } catch (err) {
    next(err);
  }
}
export const getLevelsByCourseId = async (req, res, next) => {
  try {
    const levels = await service.getLevelsByCourseId(req.params.courseId);
    res.json({ status: 'success', data: levels });
  } catch (err) {
    next(err);
  }
};

export const updateLevel = async (req, res, next) => {
  try {
    const level = await service.updateLevel(req.params.id, req.body);
    res.json(level);
  } catch (err) {
    next(err);
  }
};

export const deleteLevel = async (req, res, next) => {
  try {
    const level = await service.deleteLevel(req.params.id);
    res.json( "تم حذف المستوى بنجاح",level);
  } catch (err) {
    next(err);
  }
};

import * as service from './unit.service.js';

export const createUnit = async (req, res, next) => {
  try {
    const unit = await service.createUnit(req.body);
    res.status(201).json({ status: 'success', data: unit });
  } catch (err) {
    next(err);
  }
};

export const getAllUnits = async (req, res, next) => {
  try {
    const units = await service.getAllUnits();
    res.status(200).json({ status: 'success', data: units });
  } catch (err) {
    next(err);
  }
};

export const getUnitById = async (req, res, next) => {
  try {
    const unit = await service.getUnitById(req.params.id);
    res.status(200).json({ status: 'success', data: unit });
  } catch (err) {
    next(err);
  }
};

export const updateUnit = async (req, res, next) => {
  try {
    const updated = await service.updateUnit(req.params.id, req.body);
    res.status(200).json({ status: 'success', data: updated });
  } catch (err) {
    next(err);
  }
};

export const deleteUnit = async (req, res, next) => {
  try {
    await service.deleteUnit(req.params.id);
    res.json({ status: 'تم حذف الوحدة بنجاح' }).status(204).end();
  } catch (err) {
    next(err);
  }
};
 
import { UnitModel } from './unit.model.js';

export const createUnit = async (data) => {
  return await UnitModel.create(data);
};

export const getAllUnits = async () => {
  return await UnitModel.find().populate('levelId', 'title');
};

export const getUnitById = async (id) => {
  return await UnitModel.findById(id).populate('levelId', 'title');
};

export const updateUnit = async (id, data) => {
  return await UnitModel.findByIdAndUpdate(id, data, { new: true });
};

export const deleteUnit = async (id) => {
  return await UnitModel.findByIdAndDelete(id);
};

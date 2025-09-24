import {CategoryModel as Category} from './category.model.js';
import AppError from '../../utils/appError.js';

export const getCategories = async ({ page = 1, limit = 20 } = {}) => {
  const skip = (page - 1) * limit;

  const [categories, total] = await Promise.all([
    Category.find({ isActive: true })
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit),
    Category.countDocuments({ isActive: true })
  ]);

  return { categories, total };
};

export const createCategory = async (categoryData) => {
  const existing = await Category.findOne({ 
    name: categoryData.name 
  });

  if (existing) {
    throw new AppError('الفئة موجودة بالفعل', 400);
  }

  const category = new Category(categoryData);
  return await category.save();
};

// Optional enhancement: update category
export const updateCategory = async (id, updates) => {
  const category = await Category.findByIdAndUpdate(id, updates, { new: true });
  if (!category) throw new AppError('الفئة غير موجودة', 404);
  return category;
};

// Optional enhancement: soft delete
export const deleteCategory = async (id) => {
  const category = await Category.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true }
  );
  if (!category) throw new AppError('الفئة غير موجودة', 404);
  return category;
};

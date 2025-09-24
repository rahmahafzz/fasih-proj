import * as categoryService from './category.service.js';
import catchAsync from '../../utils/catchAsync.js';

// GET /categories
export const getCategoriesController = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;

  const { categories, total } = await categoryService.getCategories({ page, limit });

  res.status(200).json({
    success: true,
    data: categories,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit)
    }
  });
});

// POST /categories
export const createCategoryController = catchAsync(async (req, res) => {
  const category = await categoryService.createCategory(req.body);
  
  res.status(201).json({
    success: true,
    data: category
  });
});

//  PUT /categories/:id
export const updateCategoryController = catchAsync(async (req, res) => {
  const updated = await categoryService.updateCategory(req.params.id, req.body);

  res.status(200).json({
    success: true,
    data: updated
  });
});

//  DELETE /categories/:id
export const deleteCategoryController = catchAsync(async (req, res) => {
  const deleted = await categoryService.deleteCategory(req.params.id);

  res.status(200).json({
    success: true,
    message: 'تم حذف الفئة بنجاح',
    data: deleted
  });
});

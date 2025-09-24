import { BookModel as Book } from "./book.model.js";
import  AppError from "../../utils/appError.js";
import { CategoryModel as  Category} from "./category.model.js";
import mongoose from "mongoose";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const getBooks = async (query = {}) => {
  const {
    page = 1,
    limit = 12,
    search,
    category,
    sortBy = 'createdAt'
  } = query;

  const allowedSortFields = ['createdAt', 'downloads', 'title'];
  if (!allowedSortFields.includes(sortBy)) {
    throw new AppError('ترتيب غير مسموح به', 400);
  }

  const filter = { isActive: true };

  if (search) {
    filter.$text = { $search: search };
  }

  if (category) {
    filter.category = category;
  }

  const skip = (page - 1) * limit;

  const books = await Book.find(filter)
    .populate('category', 'name color')
    .sort({ [sortBy]: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const total = await Book.countDocuments(filter);

  return {
    books,
    pagination: {
      current: parseInt(page),
      total: Math.ceil(total / limit),
      count: total,
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1
    }
  };
};
export const getBookById = async (id) => {
  if (!isValidObjectId(id)) {
    throw new AppError('معرف الكتاب غير صالح', 400);
  }

  const book = await Book.findOne({ _id: id, isActive: true })
    .populate('category', 'name color');

  if (!book) {
    throw new AppError('الكتاب غير موجود أو غير متاح', 404);
  }

  return book;
};

export const createBook = async (bookData) => {
 
  const categoryExists = await Category.findById(bookData.category);
  if (!categoryExists) {
    throw new AppError('الفئة غير موجودة', 400);
  }

  const book = new Book(bookData);
  return await book.save();
};


export const searchBooks = async (searchTerm) => {
  if (!searchTerm || searchTerm.trim() === '') {
    throw new AppError('كلمة البحث مطلوبة', 400);
  }

  return await Book.find({
    isActive: true,
    $text: { $search: searchTerm }
  })
    .populate('category', 'name color')
    .sort({ score: { $meta: 'textScore' } })
    .limit(20)
    .lean();
};

export const downloadBook = async (bookId) => {
  if (!isValidObjectId(bookId)) {
    throw new AppError('معرف الكتاب غير صالح', 400);
  }

  const book = await Book.findOneAndUpdate(
    { _id: bookId, isActive: true },
    { $inc: { downloads: 1 } },
    { new: true }
  ).lean();

  if (!book) {
    throw new AppError('الكتاب غير موجود أو غير متاح للتحميل', 404);
  }

  return book.fileUrl;
};
import * as bookService from './book.service.js';
import catchAsync from '../../utils/catchAsync.js';
import AppError from '../../utils/appError.js';

export const getBooksController = catchAsync(async (req, res) => {
  const result = await bookService.getBooks(req.query);
  res.status(200).json({
    success: true,
    data: result.books,
    pagination: result.pagination
  });
});

export const getBookController = catchAsync(async (req, res) => {
  const book = await bookService.getBookById(req.params.id);

  res.status(200).json({
    success: true,
    message: 'تم جلب الكتاب بنجاح',
    data: book
  });
});

export const createBookController = catchAsync(async (req, res) => {
  const fileUrl =
    req.files?.fileUrl?.[0]?.path || req.body.fileUrl;

  const coverImage =
    req.files?.coverImage?.[0]?.path || req.body.coverImage;
    const bookData = {
    ...req.body,
    fileUrl,
    coverImage,
  };
  const book = await bookService.createBook(bookData);
    if (!book) {
    throw new AppError('يرجى رفع ملف الكتاب (PDF)', 400);
  }
  res.status(201).json({
    success: true,
    message: 'تم إنشاء الكتاب بنجاح',
    data: book
  });
});

export const searchBooksController = catchAsync(async (req, res) => {
  const { keyword } = req.query;
  if (!keyword) {
    throw new AppError('كلمة البحث مطلوبة', 400);
  }
  const books = await bookService.searchBooks(keyword);
  res.status(200).json({
    success: true,
    data: books
  });
});

export const downloadBookController = catchAsync(async (req, res) => {
  const fileUrl = await bookService.downloadBook(req.params.id);
  
  res.json({
    success: true,
    downloadUrl: fileUrl
  });
});
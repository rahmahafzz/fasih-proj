import { z } from 'zod';
import { isValidObjectId } from 'mongoose'; 

export const createPostSchema = z.object({
  content: z.string().min(1, 'يجب كتابة محتوى للمنشور'),
  categoryName: z.enum(['نحو', 'صرف', 'بلاغة', "محبى الشعر", 'معاني', 'نقاش عام']).optional(),
});
export const addCommentSchema = z.object({
  text: z.string().min(1, 'التعليق مطلوب'),
  postId: z.string().refine(isValidObjectId, 'معرف المنشور غير صالح')
});

export const toggleLikeSchema = z.object({
  postId: z.string().refine(isValidObjectId, 'معرف المنشور غير صالح')
});

export const createCategorySchema = z.object({
  name: z.string().min(2, 'اسم التصنيف مطلوب')
});
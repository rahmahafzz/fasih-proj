import catchAsync from '../../utils/catchAsync.js';
import { createPostSchema, addCommentSchema, toggleLikeSchema , createCategorySchema} from './post.validation.js';
import * as postService from './post.service.js';
import { CommunityCategoryModel } from './communityCategory.model.js';

export const createPost = catchAsync(async (req, res) => {
  const { content, category } = req.body;
  const post = await postService.createPostService({
    content, category
  });

  res.status(201).json({
    message: 'تم إنشاء المنشور بنجاح',
    data: post
  });
});
export const getAllPosts = catchAsync(async (req, res) => {
  const posts = await postService.getAllPosts();
  res.status(200).json({ success: true, data: posts });
});

export const addComment = catchAsync(async (req, res) => {
  const { postId, text } = addCommentSchema.parse(req.body);
  const post = await postService.addCommentToPost(req.user._id, postId, text);
  res.status(200).json({ success: true, message: 'تم إضافة التعليق', data: post });
});

export const toggleLike = catchAsync(async (req, res) => {
  const { postId } = toggleLikeSchema.parse(req.body);
  const result = await postService.toggleLike(req.user._id, postId);
  res.status(200).json({ success: true, liked: result.liked });
});

export const getCommunityUsersByCategory = catchAsync(async (req, res) => {
  const category = req.params.name;

  const data = await postService.getUsersByCommunityCategory(category);

  res.status(200).json({
    success: true,
    data
  });
});

export const createNewCategory = catchAsync(async (req, res) => {
  const validated = createCategorySchema.parse(req.body);
  const category = await postService.createCategory(validated);

  res.status(201).json({ success: true, data: category });
});

export const getCategories = catchAsync(async (req, res) => {
  const categories = await postService.getAllCategories();
  res.status(200).json({ success: true, data: categories });
});

export const getCategoriesWithPosts = catchAsync(async (req, res, next) => {
  const data = await postService.getCategoriesWithPosts();
  res.status(200).json({ status: 'success', data });

  
});

// export const getCategoriesWithPosts = async (req, res, next) => {
//   try {
//     const categories = await CommunityCategoryModel.aggregate([
//       {
//         $lookup: {
//           from: 'posts', // اسم مجموعة المنشورات (تأكد أنه صحيح)
//           localField: '_id',
//           foreignField: 'category',
//           as: 'posts'
//         }
//       },
//       {
//         $unwind: {
//           path: '$posts',
//           preserveNullAndEmptyArrays: true
//         }
//       },
//       {
//         $lookup: {
//           from: 'comments',
//           localField: 'posts._id',
//           foreignField: 'post',
//           as: 'posts.comments'
//         }
//       },
//       {
//         $lookup: {
//           from: 'likes',
//           localField: 'posts._id',
//           foreignField: 'post',
//           as: 'posts.likes'
//         }
//       },
//       {
//         $addFields: {
//           'posts.commentsCount': { $size: '$posts.comments' },
//           'posts.likesCount': { $size: '$posts.likes' }
//         }
//       },
//       {
//         $group: {
//           _id: '$_id',
//           name: { $first: '$name' },
//           posts: {
//             $push: {
//               _id: '$posts._id',
//               content: '$posts.content',
//               createdAt: '$posts.createdAt',
//               likesCount: '$posts.likesCount',
//               commentsCount: '$posts.commentsCount'
//             }
//           }
//         }
//       },
//       {
//         $project: {
//           name: 1,
//           posts: {
//             $filter: {
//               input: '$posts',
//               as: 'post',
//               cond: { $ne: ['$$post._id', null] }
//             }
//           }
//         }
//       }
//     ]);

//     res.status(200).json({ status: 'success', data: categories });
//   } catch (err) {
//     next(err);
//   }
// };
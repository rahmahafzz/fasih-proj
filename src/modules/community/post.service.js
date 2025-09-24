import { PostModel } from './post.model.js';
import AppError from '../../utils/appError.js';
import { UserModel } from '../Auth/auth.model.js';
import { CommunityCategoryModel } from './communityCategory.model.js';
import { getUserByEmail } from '../../utils/user.utils.js';

export const createPostService = async ({ content, category, userId }) => {
  const runTaskForUser = async ()=>{
    const userId = await getUserByEmail('marwaelhusseiny177@gmail.com');
    if(!userId) throw new AppError('المستخدم غير موجود', 404);
    return userId;
  }
  const categoryName = category.trim(); 
  const categoryFound = await CommunityCategoryModel.findOne({ name: categoryName });
// .populate('category', 'name');
  if (!categoryFound) {
    throw new AppError('الفئة غير موجودة', 404);
  }

 
  const newPost = await PostModel.create({
    content,
    category: categoryFound._id, 
    categoryName,
    createdBy: await runTaskForUser()
  });

 return {
    ...newPost.toObject(),
    categoryName: categoryFound.name // Add category name manually
  };
  // return newPost;
};

export const getAllPosts = async () => {
  return await PostModel.find({ isActive: true })
    .sort({ createdAt: -1 })
    .populate('createdBy', 'fullName avatar')
    .populate('comments.user', 'fullName avatar')
    .lean();
};

export const addCommentToPost = async (userId, postId, text) => {
  const post = await PostModel.findById(postId);
  if (!post) throw new AppError('المنشور غير موجود', 404);

  post.comments.push({ user: userId, text });
  await post.save();
  return post;
};

export const toggleLike = async (userId, postId) => {
  const post = await PostModel.findById(postId);
  if (!post) throw new AppError('المنشور غير موجود', 404);

  const alreadyLiked = post.likes.includes(userId);
  if (alreadyLiked) {
    post.likes.pull(userId);
  } else {
    post.likes.push(userId);
  }

  await post.save();
  return { liked: !alreadyLiked };
};

    
export const getUsersByCommunityCategory = async (category) => {
const validCategories = ['البحور الشعرية', 'قصائد على السطور', 'مدرسة العرّاب', 'محبى الشعر', 'نقاش عام'];    
  if (!validCategories.includes(category)) {
    throw new AppError('فئة غير صالحة', 400);
  }
const categoryDoc = await CommunityCategoryModel.findOne({ name: category });
  if (!categoryDoc) throw new AppError("التصنيف غير موجود", 404);
  
 const posts = await PostModel.find({ category: categoryDoc._id, isActive: true })
    .populate('createdBy', 'role avatar')
    .populate('comments.user', 'fullName email')
    .lean();

 const result = posts.map(post => ({
    postId: post._id,
    postedBy: post.createdBy,
    content: post.content,
    likesCount: post.likes?.length || 0,
    commentsCount: post.comments?.length || 0,
    commentedUsers: post.comments.map(c => c.user)
  }));

  return result;
};
export const createCategory = async (data) => {
  const existing = await CommunityCategoryModel.findOne({ name: data.name });
  if (existing) throw new Error('هذا التصنيف موجود بالفعل');
  return await CommunityCategoryModel.create(data);
};

export const getAllCategories = async () => {
  const categories = await CommunityCategoryModel.find()
  return categories
};

export const getCategoriesWithPosts = async () => {
  const categories = await CommunityCategoryModel.find()
    .populate({
      path: 'posts',
      model: 'Post',
      match: { isActive: true },
      populate: [
        { path: 'createdBy', select: 'fullName email' },
        { path: 'comments.user', select: 'fullName email' }
      ]
    });

  // Add likeCount and commentCount
 const result = await CommunityCategoryModel.aggregate([
  {
    $lookup: {
      from: 'posts', 
      localField: '_id',
      foreignField: 'category',
      as: 'posts'
    }
  },
  {
    $project: {
      name: 1,
      posts: {
        $map: {
          input: '$posts',
          as: 'post',
          in: {
            _id: '$$post._id',
            content: '$$post.content',
            image: '$$post.image',
            likesCount: { $size: { $ifNull: ['$$post.likes', []] } },
            commentsCount: { $size: { $ifNull: ['$$post.comments', []] } }
          }
        }
      }
    }
  }
]);

  return result;
};

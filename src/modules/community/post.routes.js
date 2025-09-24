import express from 'express';
import * as postController from './post.controller.js';
import { protect } from '../../middlewares/auth.middleware.js';


const router = express.Router();
// router.use(protect);
router.post('/', postController.createPost);
router.get('/', postController.getAllPosts);
router.get('/category/:name/users', postController.getCommunityUsersByCategory);
router.get('/allcategories', postController.getCategories);
router.get('/search-categories-with-posts', postController.getCategoriesWithPosts);
router.post('/categories', postController.createNewCategory);
router.post('/comment', postController.addComment);
router.post('/like', postController.toggleLike);

export default router;
// http://localhost:5000/api/v1/community/post/category/نقاش%20عام/users


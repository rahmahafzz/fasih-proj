import express from 'express';
import * as userController from './user.controller.js';
import { protect } from '../../middlewares/auth.middleware.js';



const router = express.Router();

// router.use(protect);
router.get('/getUser/:id', userController.getUserById);
router.route('/avatar') 
.put( userController.updateUserAvatar).delete(userController.deleteUserAvatar);
router.post('/avatar/validate', userController.validateAvatarUrl);
router.get('/settings',  userController.getSettingsOptions);
router.get('/settings/edit-profile', userController.getEditProfile);
router.get('/settings/notifications', userController.getNotifications);
router.get('/settings/accessibility', userController.getUserAccessibility);
router.get('/security', userController.getSecurityInfo);
router.get('/settings/about', userController.getAboutInfo);
router.get('/security/remember-me', userController.getToggleRememberMe);
router.patch('/settings/edit-profile',  userController.updateProfile  );
router.patch('/settings/notifications',  userController.updateNotifications);
router.patch('/setting/accessibility', userController.updateAccessibility);
router.patch('/settings/seurity/RememberMe', userController.toggleRememberMe);
router.patch('/settings/security/refresh-pass', userController.updatePassword);
router.patch('/settings/security/refresh-email', userController.updateEmail);


export default router;

import express from 'express';
import * as controller from './auth.controller.js';
import validate from '../../middlewares/validate.js';
import { signupSchema, loginSchema, otpSchema } from './auth.validation.js';
import { forgotPasswordSchema, resetPasswordSchema } from './auth.validation.js';
import { protect } from '../../middlewares/auth.middleware.js';
import { authorize } from '../../middlewares/role.middleware.js';
import { promoteUserSchema } from './auth.validation.js';

const router = express.Router();
 

router.post('/signup', validate(signupSchema), controller.register);
router.post('/login', validate(loginSchema), controller.login);
// router.post('/refresh-token', controller.refreshTokenSimple);
router.post('/verify-otp', validate(otpSchema), controller.verifyOTP);
router.post('/resend-otp', controller.resendOTP);
router.post('/forgot-password', validate(forgotPasswordSchema), controller.forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), controller.resetPassword);
router.get('/admin/dashboard',  authorize('admin'), (req, res) => {
  res.send('لوحة تحكم المدير ');
});
router.patch( '/promote', authorize('admin'), //  Only admin can promote
  validate(promoteUserSchema),controller.promoteUser);
router.post('/logout', controller.logout);

export default router;

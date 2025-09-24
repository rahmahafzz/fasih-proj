import { z } from 'zod';

export const signupSchema = z.object({
  fullName: z.string().min(3, 'الاسم مطلوب'),
  email: z.string().email('بريد إلكتروني غير صالح'),
  password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 حروف على الأقل'),
  confirmPassword: z.string().min(6, 'يجب تأكيد كلمة المرور'),
  role: z.enum(['learner', 'admin', 'vendor' ]).optional(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'كلمتا المرور غير متطابقتين',
  path: ['confirmPassword']
});

export const loginSchema = z.object({
  email: z.string().email('البريد غير صالح'),
  password: z.string().min(6, 'كلمة المرور مطلوبة')
});

export const otpSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6, 'OTP يجب أن يكون 6 أرقام')
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('البريد الإلكتروني غير صالح')
});

export const resetPasswordSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6, 'OTP يجب أن يكون 6 أرقام'),
  newPassword: z.string().min(6, 'كلمة المرور الجديدة قصيرة')
});

export const promoteUserSchema = z.object({
  userId: z.string().min(1, 'مطلوب معرف المستخدم'),
  role: z.enum(['admin', 'vendor'], {
    required_error: 'مطلوب الدور',
    invalid_type_error: 'الدور يجب أن يكون admin أو vendor',
  }),
});

export const updateProfileSchema = z.object({
  fullName: z.string().min(3).max(50).optional(),
  email: z.string().email().optional(),
  mobileNumber: z.string().min(7).max(20).optional(),
  bio: z.string().max(500).optional(),
  country: z.string().optional(),
  dateOfBirth: z.string().optional() ,
  notificationsEnabled: z.boolean().optional(),
  
});



import * as userService from './user.service.js';
import catchAsync from '../../utils/catchAsync.js';
import { updateProfileSchema } from '../Auth/auth.validation.js';
import AvatarService from './user.service.js';
import { z } from 'zod';
import { resetPassword }  from '../Auth/auth.controller.js';
import { UserModel } from '../Auth/auth.model.js';
import AppError from '../../utils/appError.js';
import { getUserByEmail } from '../../utils/user.utils.js';


// avatar validation
export const avatarUrlSchema = z.object({
  avatarUrl: z.string()
  // .url('Must be a valid URL')
  // .refine(
    // (url) => {
    //   // Check if URL ends with image extension
    //   const imageExtensions = /\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i;
    //   return imageExtensions.test(url);
    // },
    // {
    //   message: 'URL must point to an image file (jpg, jpeg, png, gif, webp)'
    // }
  // )
});

export const getUserById = catchAsync(async (req, res) => {
const runTaskForUser = async ()=>{
      const userId = await getUserByEmail('marwaelhusseiny177@gmail.com');
      if(!userId) throw new AppError('المستخدم غير موجود', 404);
      return userId;
    }
   const userId = await runTaskForUser();


  // const userId = req.user?._id;
  const user = await userService.getUserById(userId);
  res.status(200).json({ status: 'success', data: {
      id: userId,
      name: user.name,
      email: user.email,
      fullName: user.fullName,
      profile: user.profile,
      preferences: user.preferences,
      avatarUrl: user.avatarUrl, // Virtual field with fallback
      isActive: user.isActive,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
      country: user.country }
  });
});

export const getSettingsOptions = catchAsync(async (req, res) => {
  const options = userService.getSettingsOptions();
  res.status(200).json({
    status: 'success',
    data: options
  });
});

export const updateProfile = catchAsync(async (req, res) => {
  const parsed = updateProfileSchema.safeParse(req.body);
  const runTaskForUser = async ()=>{
      const userId = await getUserByEmail('marwaelhusseiny177@gmail.com');
      if(!userId) throw new AppError('المستخدم غير موجود', 404);
      return userId;
    }
   const userId = await runTaskForUser();
  
  if (!parsed.success) {
    return res.status(400).json({ message: 'بيانات غير صالحة', errors: parsed.error.errors });
  }

  const updatedUser = await userService.updateUserProfile(userId, parsed.data);
  res.status(200).json({ message: 'تم تحديث الملف الشخصي بنجاح', user: updatedUser });
});

export const getEditProfile = catchAsync(async (req, res) => {
  const runTaskForUser = async ()=>{
      const userId = await getUserByEmail('marwaelhusseiny177@gmail.com');
      if(!userId) throw new AppError('المستخدم غير موجود', 404);
      return userId;
    }
   const userId = await runTaskForUser();

  const user = await userService.getUserById(userId);
  res.status(200).json({
    status: 'success',
    data: {
      avatar: user.avatar, 
      fullName: user.fullName,
      mobileNumber: user.mobileNumber,
      email: user.email,
      dateOfBirth: user.dateOfBirth,
      country: user.country,
    },
  });
});
export const updateUserAvatar = catchAsync(async (req, res) => {
  try {
    const { avatarUrl } = avatarUrlSchema.parse(req.body);
    
    const user = await UserModel.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Validate that the URL is accessible and points to an image
    try {
      await AvatarService.validateImageUrl(avatarUrl);
    } catch (validationError) {
      return res.status(400).json({
        success: false,
        message: `Invalid avatar URL: ${validationError.message}`
      });
    }
    
    // Update user avatar
    user.profile.avatar = avatarUrl;
    await user.save();
    
    res.json({
      success: true,
      message: 'Avatar updated successfully',
      data: {
        avatar: user.profile.avatar,
        avatarUrl: user.avatarUrl
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors
      });
    }
    throw error;
  }
});
//  Delete user avatar
export const deleteUserAvatar = catchAsync(async (req, res) => {
  const user = await UserModel.findById(req.user._id);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }
  
  // Remove avatar URL
  user.profile.avatar = null;
  await user.save();
  
  res.json({
    success: true,
    message: 'Avatar removed successfully',
    data: {
      avatarUrl: user.avatarUrl // Will return generated default avatar
    }
  });
});

//    Validate avatar URL
export const validateAvatarUrl = catchAsync(async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({
        success: false,
        message: 'URL is required'
      });
    }
    
    // Validate URL format
    const { avatarUrl } = avatarUrlSchema.parse({ avatarUrl: url });
    
    // Check if URL is accessible
    const validation = await AvatarService.validateImageUrl(avatarUrl);
    
    res.json({
      success: true,
      message: 'Avatar URL is valid',
      data: {
        url: avatarUrl,
        contentType: validation.contentType,
        size: validation.size,
        isKnownHost: AvatarService.isKnownAvatarHost(avatarUrl)
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Invalid URL format',
        errors: error.errors
      });
    }
    
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to validate avatar URL'
    });
  }
});

export const getNotifications = catchAsync(async (req, res) => {
  const runTaskForUser = async ()=>{
      const userId = await getUserByEmail('marwaelhusseiny177@gmail.com');
      if(!userId) throw new AppError('المستخدم غير موجود', 404);
      return userId;
    }
   const userId = await runTaskForUser();
  const user = await UserModel.findById(userId)
    .select('preferences.notificationsEnabled')
    .lean();
  if (!user || !user.preferences) {
    return res.status(404).json({ message: 'لم يتم العثور على المستخدم أو التفضيلات' });
  }
  res.status(200).json({
    status: 'success',
    data: {
      notificationsEnabled: user.preferences.notificationsEnabled
    },
  });
});

export const updateNotifications = catchAsync(async (req, res) => {
  const runTaskForUser = async ()=>{
      const userId = await getUserByEmail('marwaelhusseiny177@gmail.com');
      if(!userId) throw new AppError('المستخدم غير موجود', 404);
      return userId;
    }
   const userId = await runTaskForUser();
  // const userId = req.user._id;
  const { notificationsEnabled } = req.body;

  if (typeof notificationsEnabled !== 'boolean') {
    throw new AppError('قيمة الإشعارات يجب أن تكون true أو false', 400);
  }
  const updatedUser = await userService.updateNotificationStatus(userId, notificationsEnabled);
  res.status(200).json({
    status: 'success',
    message: 'تم تحديث حالة الإشعارات بنجاح',
    data: { notificationsEnabled: updatedUser.preferences.notificationsEnabled }
  });
});

export const getUserAccessibility = catchAsync(async (req, res) => {
  
  const runTaskForUser = async ()=>{
      const userId = await getUserByEmail('marwaelhusseiny177@gmail.com');
      if(!userId) throw new AppError('المستخدم غير موجود', 404);
      return userId;
    }
   const userId = await runTaskForUser();
  const user = await UserModel.findById(userId)
    .select('preferences.accessibility')
    .lean();
  if (!user || !user.preferences) {
    return res.status(404).json({ message: 'لم يتم العثور على المستخدم أو التفضيلات' });
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      accessibility: user.preferences.accessibility
    },
  });
})
export const updateAccessibility = catchAsync(async (req, res) => {
  const runTaskForUser = async ()=>{
      const userId = await getUserByEmail('marwaelhusseiny177@gmail.com');
      if(!userId) throw new AppError('المستخدم غير موجود', 404);
      return userId;
    }
   const userId = await runTaskForUser();
  const accessibilityData = req.body.accessibility;
  // console.log('Incoming accessibility:', req.body.accessibility);

  const result = await userService.updateUserAccessibility(userId, accessibilityData);
   res.status(200).json({
      status: 'success',
      message: 'تم تحديث تفضيلات إمكانية الوصول بنجاح',
      data: { accessibility: result }
});
});

export const getSecurityInfo = catchAsync(async (req, res) => {
  
  const runTaskForUser = async ()=>{
      const userId = await getUserByEmail('marwaelhusseiny177@gmail.com');
      if(!userId) throw new AppError('المستخدم غير موجود', 404);
      return userId;
    }
   const userId = await runTaskForUser();
  const user = await userService.getUserById(userId);
  res.status(200).json({
    status: 'success',
    data: { email: user.email,
     },
  });
});

export const updatePassword = catchAsync(async (req, res) => {
    const { currentPassword, newPassword } = req.body;

  // Just pass the hardcoded email directly
  await userService.resetPassword({
    email: 'marwaelhusseiny177@gmail.com', 
    currentPassword, 
    newPassword 
  });

  res.status(200).json({
    status: 'success',
    message: 'تم تحديث كلمة المرور بنجاح',
  });
  // const runTaskForUser = async ()=>{
  //     const userId = await getUserByEmail('marwaelhusseiny177@gmail.com');
  //     if(!userId) throw new AppError('المستخدم غير موجود', 404);
  //     return userId;
  //   }
  //  const userId = await runTaskForUser();
  // // const userEmail = req.user.email;

  // const { currentPassword, newPassword } = req.body;

  // await userService.resetPassword({email: user.email,  currentPassword, newPassword });

  // res.status(200).json({
  //   status: 'success',
  //   message: 'تم تحديث كلمة المرور بنجاح',
  // });
  // test with 
//   {
//   "userId": "687bf0b7dd73b0c9a3c1f1b3",
//   "newPassword": "42021171Marwa",
//   "email":"marwaelhusseiny@gmail.com",
//   "currentPassword":"42021171"


//   }
});

export const updateEmail = catchAsync(async (req, res) => {
  const runTaskForUser = async ()=>{
      const userId = await getUserByEmail('marwaelhusseiny177@gmail.com');
      if(!userId) throw new AppError('المستخدم غير موجود', 404);
      return userId;
    }
   const userId = await runTaskForUser();
  const  {newEmail , currentPassword  }= req.body;
  const user = await userService.updateEmail( userId  , newEmail);

  res.status(200).json({
    status: 'success',
    message: 'تم تحديث البريد الإلكتروني بنجاح',
    data: { email: user.email },
  });
});

export const toggleRememberMe = catchAsync(async (req, res) => {
  const runTaskForUser = async ()=>{
      const userId = await getUserByEmail('marwaelhusseiny177@gmail.com');
      if(!userId) throw new AppError('المستخدم غير موجود', 404);
      return userId;
    }
   const userId = await runTaskForUser();
  const { rememberMe }  = req.body;
  const result = await userService.toggleRememberMe(userId, rememberMe);

  res.status(200).json({
    status: 'success',
    message: `تم ${rememberMe ? 'تفعيل' : 'إلغاء'} خيار التذكر`,
    rememberMe: result,
  });
});

export const getToggleRememberMe = catchAsync(async (req, res) => {
  const runTaskForUser = async ()=>{
      const userId = await getUserByEmail('marwaelhusseiny177@gmail.com');
      if(!userId) throw new AppError('المستخدم غير موجود', 404);
      return userId;
    }
   const userId = await runTaskForUser();
  const user = await UserModel.findById(userId)
    .select('preferences.rememberMe')
    .lean();
  if (!user || !user.preferences) {
    return res.status(404).json({ message: 'لم يتم العثور على المستخدم أو التفضيلات' });
  }
  res.status(200).json({
    status: 'success',
    data: {
      rememberMe: user.preferences.rememberMe
    },
  });
})

export const getAboutInfo = catchAsync(async (_req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      version: '1.0.0',
      developedBy: 'Fasih Team',
      description: 'تطبيق فصيح لتعلم اللغة العربية بدعم من الذكاء الاصطناعي.',
    },
  });
});

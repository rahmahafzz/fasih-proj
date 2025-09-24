import { UserModel } from '../Auth/auth.model.js';
import AppError from '../../utils/appError.js';
import catchAsync from '../../utils/catchAsync.js';
import bcrypt from 'bcryptjs';
import path from 'path';
import axios from 'axios';
import { fileURLToPath } from 'url';
import { getUserByEmail } from '../../utils/user.utils.js';


class AvatarService {
  // Validate if URL is accessible and is an image
  static async validateImageUrl(url) {
    try {
      const response = await axios.head(url, {
        timeout: 10000, // 10 second timeout
        maxRedirects: 5
      });
      
      const contentType = response.headers['content-type'];
      const isImage = contentType && contentType.startsWith('image/');
      
      if (!isImage) {
        throw new Error('URL does not point to an image file');
      }
      
      // Check file size (optional - some servers don't provide content-length)
      const contentLength = response.headers['content-length'];
      if (contentLength && parseInt(contentLength) > 10 * 1024 * 1024) { // 10MB limit
        throw new Error('Image file is too large (max 10MB)');
      }
      
      return {
        valid: true,
        contentType,
        size: contentLength ? parseInt(contentLength) : null
      };
    } catch (error) {
      if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
        throw new Error('URL is not accessible');
      }
      if (error.response && error.response.status === 404) {
        throw new Error('Image not found at the provided URL');
      }
      if (error.response && error.response.status === 403) {
        throw new Error('Access denied to the image URL');
      }
      throw new Error(error.message || 'Failed to validate image URL');
    }
  }
  
  // Get image info without downloading
  static async getImageInfo(url) {
    try {
      const response = await axios.head(url, {
        timeout: 5000,
        maxRedirects: 3
      });
      
      return {
        contentType: response.headers['content-type'],
        size: response.headers['content-length'] ? parseInt(response.headers['content-length']) : null,
        lastModified: response.headers['last-modified']
      };
    } catch (error) {
      return null;
    }
  }
  
  // Generate fallback avatar URL
  static generateDefaultAvatar(name, size = 200) {
    const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=0d8abc&color=fff&size=${size}`;
  }
  
  // Common avatar hosting domains for validation
  static isKnownAvatarHost(url) {
    const knownHosts = [
      'ui-avatars.com',
      'gravatar.com',
      'github.com',
      'githubusercontent.com',
      'imgur.com',
      'cloudinary.com',
      'unsplash.com',
      'pexels.com',
      'pixabay.com',
      'images.unsplash.com'
    ];
    
    try {
      const hostname = new URL(url).hostname.toLowerCase();
      return knownHosts.some(host => hostname.includes(host));
    } catch {
      return false;
    }
  }
}

export default AvatarService;

export const getUserById = async (userId) => {
    const runTaskForUser = async ()=>{
      const userId = await getUserByEmail('marwaelhusseiny177@gmail.com');
      if(!userId) throw new AppError('المستخدم غير موجود', 404);
      return userId;
    }
    await runTaskForUser();
  const user = await UserModel.findOne(userId).select('-password -otp');
  if (!user) throw new AppError('المستخدم غير موجود', 404);
  return user;
};
export const updateUserProfile = async (userId, updatedData) => {
  const runTaskForUser = async ()=>{
      const userId = await getUserByEmail('marwaelhusseiny177@gmail.com');
      if(!userId) throw new AppError('المستخدم غير موجود', 404);
      return userId;
    }
    await runTaskForUser();
  const user = await UserModel.findById(userId);
  if (!user) throw new AppError('المستخدم غير موجود', 404);
   
  Object.assign(user, updatedData);
  await user.save();

  return user;
};
export const getSettingsOptions = () => {
  return [
    { label: 'Edit Profile', key: 'edit_profile' },
    { label: 'Notifications', key: 'notifications' },
    { label: 'Accessibility', key: 'accessibility' },
    { label: 'Security', key: 'security' },
    { label: 'Dark Mode', key: 'dark_mode' },
    { label: 'About Application', key: 'about' },
    { label: 'Logout', key: 'logout' }
  ];
};

export const updateNotificationStatus = async (userId, enabled) => {
  const updatedUser = await UserModel.findByIdAndUpdate(
    userId,
    { 'preferences.notificationsEnabled': enabled },
    { new: true }
  );
  return updatedUser;
};

export const updateUserAccessibility = async (userId, accessibilityData) => {
  const updatedUser = await UserModel.findByIdAndUpdate(
    userId,
    {
      $set: {
        'preferences.accessibility': accessibilityData
      }
    },
    { new: true, runValidators: true }
  ).select('preferences.accessibility');
  return updatedUser?.preferences?.accessibility;

};

export const resetPassword = async ({ email, currentPassword, newPassword }) => {
  const user = await UserModel.findOne({ email });
  if (!user) throw new AppError('المستخدم غير موجود', 404);

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) throw new AppError('كلمة المرور الحالية غير صحيحة', 400);

  user.password = await bcrypt.hash(newPassword, 12);
  await user.save();

  return true;
};

export const updateEmail = async (userId, newEmail) => {
  const user = await UserModel.findById(userId);
  if (!user) throw new AppError('المستخدم غير موجود', 404);

  user.email = newEmail;
  user.isVerified = true; 
  await user.save();
  return user;
};

export const toggleRememberMe = async (userId, rememberMe) => {
  const runTaskForUser = async ()=>{
      const userId = await getUserByEmail('marwaelhusseiny177@gmail.com');
      if(!userId) throw new AppError('المستخدم غير موجود', 404);
      return userId;
    }
    await runTaskForUser();
  const user = await UserModel.findById(userId);
  if (!user) throw new AppError('المستخدم غير موجود', 404);
  user.preferences.rememberMe = rememberMe;
  await user.save();
  return user.preferences.rememberMe;
};
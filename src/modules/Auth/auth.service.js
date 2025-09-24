import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel } from './auth.model.js';
import { sendOtpEmail } from '../../utils/sendOtp.js';
import AppError from '../../utils/appError.js';
import { generateAccessToken, generateRefreshToken , generateOtp} from '../../utils/generateTokens.js';
import catchAsync from '../../utils/catchAsync.js';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const JWT_ACCESS_SECRET = process.env.JWT_SECRET;

export const register = async ({ fullName, email, password, confirmPassword, role }) => {
  const userExists = await UserModel.findOne({ email });
  if (userExists) throw new AppError('المستخدم موجود بالفعل', 400); 
  const hashedPassword = await bcrypt.hash(password, 10);
  const otp = generateOtp();
  const userRole = (role === 'admin' && email === process.env.ADMIN_EMAIL) ? 'admin' : 'learner';
  const user = await UserModel.create({
    fullName,
    email: email.trim().toLowerCase(),
    password: hashedPassword,
    role: userRole,
    otp,
    otpExpires: Date.now() + 10 * 60 * 1000
  });

  await sendOtpEmail(email, otp);
  return user;


};


export const login = async ({ email, password }) => {
  email = email.trim().toLowerCase();
  const user = await UserModel.findOne({ email });
  if (!user || !bcrypt.compareSync(password, user.password)) {
    throw new AppError('البريد الإلكتروني أو كلمة المرور غير صحيحة', 400);
  }

  if (!user.isVerified) throw new AppError('يرجى التحقق من البريد الإلكتروني أولاً', 403);
  
  return {
     accessToken: generateAccessToken(user._id),
    // refreshToken: generateRefreshToken(user._id),
  };
};

export const verifyOTP = async ({ email, otp }) => {
  // Normalize email (important for consistent querying)
  const normalizedEmail = email.trim().toLowerCase();
  const user = await UserModel.findOne({
    email: normalizedEmail,
    otp,
    otpExpires: { $gt: Date.now() },
  });

  if (!user || user.otpExpires < Date.now()) {
    throw new AppError('OTP غير صالح أو منتهي', 400);
  }

  user.isVerified = true;
  user.otp = undefined;
  user.otpExpires = undefined;
  await user.save();
  return true;
};

export const resendOTP = async ({ email }) => {
  const user = await UserModel.findOne({ email });

  if (!user) {
    throw new AppError('لا يوجد مستخدم بهذا البريد الإلكتروني', 404);
  }

  if (user.isVerified) {
    throw new AppError('تم التحقق بالفعل من هذا البريد الإلكتروني', 400);
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  user.otp = otp;
  user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  await user.save();

  await sendOtpEmail(user.email, otp);

  return true;
};
export const forgotPassword = async (email) => {
  const user = await UserModel.findOne({ email });
  if (!user) throw new AppError('لا يوجد مستخدم بهذا البريد الإلكتروني', 404);

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.otp = otp;
  user.otpExpires = Date.now() + 10 * 60 * 1000;
  await user.save();

  await sendOtpEmail(email, otp);
  return true;
};

export const resetPassword = async ({ email, otp, newPassword }) => {
  const user = await UserModel.findOne({ email, otp });
  if (!user || user.otpExpires < Date.now()) {
    throw new AppError('OTP غير صالح أو منتهي', 400);
  }

  user.password = bcrypt.hashSync(newPassword, 10);
  user.otp = undefined;
  user.otpExpires = undefined;
  await user.save();
  return true;
};

// export const changeEmailService = async ({ userId, currentPassword, newEmail }) => {
//   const user = await UserModel.findById(userId);
//   if (!user) throw new AppError('المستخدم غير موجود', 404);

//   const isMatch = await bcrypt.compare(currentPassword, user.password);
//   if (!isMatch) throw new AppError('كلمة المرور غير صحيحة', 401);

//   const existing = await UserModel.findOne({ email: newEmail });
//   if (existing) throw new AppError('هذا البريد الإلكتروني مستخدم بالفعل', 409);

//   user.email = newEmail;
//   user.isVerified = false; 
//   await user.save();

//   return { message: 'تم تحديث البريد الإلكتروني بنجاح' };
// };


export const promoteUser = async (userId, role) => {
  if (!['admin', 'vendor'].includes(role)) {
    throw new AppError('الدور غير صالح', 400);
  }

  const updatedUser = await UserModel.findByIdAndUpdate(
    userId,
    { role },
    { new: true }
  );

  return updatedUser;
};


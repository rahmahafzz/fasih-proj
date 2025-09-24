import * as service from './auth.service.js';
import asyncHandler from 'express-async-handler';
import catchAsync from '../../utils/catchAsync.js';
import { UserModel } from './auth.model.js';
import jwt from 'jsonwebtoken';
import   appError from '../../utils/appError.js';
import { generateAccessToken } from '../../utils/generateTokens.js';
import { generateRefreshToken } from '../../utils/generateTokens.js';

const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const JWT_ACCESS_SECRET = process.env.JWT_SECRET;

export const register = asyncHandler(async (req, res) => {
  const user = await service.register(req.body);
  res.status(201).json({ message: 'تم التسجيل بنجاح. تحقق من البريد الإلكتروني', user });
});

export const login = asyncHandler(async (req, res) => {
  const token = await service.login(req.body);
  res.cookie('refreshToken', token.refreshToken, { 
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  });
  res.status(200).json({ message: 'تم تسجيل الدخول بنجاح', ...token 
  });
});

export const refreshTokenSimple = catchAsync(async (req, res, next) => {
  try {
    
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(400).json({ error: 'No refresh token in cookies' });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    
    const user = await UserModel.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const newAccessToken = generateAccessToken(user._id);
    
    res.json({
      status: 'success',
      accessToken: newAccessToken,
    });
    
  } catch (error) {
    res.status(500).json({
      error: error.name,
      message: error.message,
      stack: error.stack
    });
  }
});

export const verifyOTP = asyncHandler(async (req, res) => {
  const verified = await service.verifyOTP(req.body);
  res.status(200).json({ message: 'تم التحقق من البريد بنجاح', verified });
  
});

export const resendOTP = asyncHandler(async (req, res) => {
  await service.resendOTP(req.body);
  res.status(200).json({ message: 'تم إرسال رمز التحقق مرة أخرى إلى البريد الإلكتروني' });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  await service.forgotPassword(req.body.email);
  res.status(200).json({ message: 'تم إرسال رمز إعادة تعيين كلمة المرور إلى بريدك الإلكتروني' });
});

export const resetPassword = asyncHandler(async (req, res) => {
   const currentPassword = req.body;
  const result = await service.resetPassword(currentPassword);
  res.status(200).json({ message: 'تم إعادة تعيين كلمة المرور بنجاح' });
});

// export const changeEmail = async (req, res, next) => {
//   try {
//     const { currentPassword, newEmail } = req.body;
//     const result = await service.changeEmailService({
//       userId: req.user.id,
//       currentPassword,
//       newEmail,
//     });

//     res.status(200).json(result);
//   } catch (err) {
//     next(err);
//   }
// };
  
export const promoteUser = async (req, res, next) => {
  try {
    const { userId, role } = req.body;

    const updatedUser = await service.promoteUser(userId, role);

    if (!updatedUser) {
      return res.status(404).json({ message: 'المستخدم غير موجود' });
    }

    res.status(200).json({
      message: `تم تحديث الدور إلى ${role}`,
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

export const logout = catchAsync(async (req, res, next) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
  });

  res.status(200).json({
    status: 'success',
    message: 'تم تسجيل الخروج بنجاح',
  });
});
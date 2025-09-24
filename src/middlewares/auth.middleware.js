import jwt from 'jsonwebtoken';
import { UserModel } from '../modules/Auth/auth.model.js';

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;

export const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'غير مصرح' });

    const decoded = jwt.verify(token, JWT_ACCESS_SECRET);
    const user = await UserModel.findById(decoded.id).select('-password');

    if (!user) return res.status(401).json({ message: 'المستخدم غير موجود' });

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'رمز غير صالح أو منتهي' });
  }
};

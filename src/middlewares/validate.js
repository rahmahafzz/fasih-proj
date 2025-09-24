
// const validate = (schema) => (req, res, next) => {
//   try {
//     req.body = schema.parse(req.body);
//     next();
//   } catch (err) {
//     res.status(400).json({ error: err.errors[0].message });
//   }
// };

// export default validate;

import AppError from '../utils/appError.js';

const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (err) {
    if (err.errors && err.errors.length > 0) {
      const zodError = err.errors[0]; 
      const field = zodError.path?.[0] || 'unknown';
      const message = zodError.message;

      return next(new AppError(message, 400, field));
    }

    next(new AppError('Invalid request body', 400));
  }
};

export default validate;

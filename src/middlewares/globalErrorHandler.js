// Central error handler
const globalErrorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'حدث خطأ في السيرفر';

  res.status(statusCode).json({
    status: err.status || 'error',
    code: statusCode,
    error: err.name || 'InternalServerError',
    message: err.message || 'حدث خطأ ما',
    details: err.field
      ? {
          field: err.field,
          issue: err.message
        }
      : undefined,
    timestamp: new Date().toISOString()
  });
};

export default globalErrorHandler;

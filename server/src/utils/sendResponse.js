export const sendSuccess = (res, data, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

export const sendError = (res, message = 'Error', statusCode = 400, code = 'ERROR') => {
  return res.status(statusCode).json({
    error: true,
    message,
    code
  });
};

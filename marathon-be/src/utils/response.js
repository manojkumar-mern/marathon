export const successResponse = (res, { statusCode = 200, message = "Success", data = null } = {}) => {
  const body = { success: true, message };
  if (data !== null) body.data = data;
  return res.status(statusCode).json(body);
};

export const errorResponse = (res, { statusCode = 500, message = "Internal server error" } = {}) => {
  return res.status(statusCode).json({
    success: false,
    message,
  });
};

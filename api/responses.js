export const apiSuccess = (data) => ({
  success: true,
  data
});

export const apiFail = (error) => ({
  success: false,
  error
});

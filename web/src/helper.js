export const validate = (initialValue) => {
  const error = {};
  Object.entries(initialValue).map(([key, value]) => {
    if (value.length) error[key] = false;
    else error[`${key}Error`] = true;
  });
  return error;
};

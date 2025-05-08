export const isEmailValid = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
export const isPasswordValid = (password) => {
  const hasNumber = /\d/.test(password);
  const hasUpperCase = /[A-Z]/.test(password);
  const hasSpecialChar = /\W/.test(password);

  if (!hasUpperCase) {
    return {
      success: false,
      message: "Password must contain at least one uppercase letter.",
    };
  } else if (!hasNumber) {
    return {
      success: false,
      message: "Password must contain at least one number.",
    };
  } else if (!hasSpecialChar) {
    return {
      success: false,
      message: "Password must contain at least one special character.",
    };
  } else if (password.length < 8) {
    return {
      success: false,
      message: "Password must be at least 8 characters long.",
    };
  } else {
    return { success: true };
  }
};


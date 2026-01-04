export const checkValidData = (name, email, password) => {
  /* =======================
     NAME VALIDATION (Sign Up only)
  ======================= */
  if (name !== null) {
    if (name.trim().length < 3) {
      return "Name must be at least 3 characters long";
    }

    const nameRegex = /^[A-Za-z ]+$/;
    if (!nameRegex.test(name)) {
      return "Name should contain only letters";
    }
  }

  /* =======================
     EMAIL VALIDATION
  ======================= */
  if (!email) {
    return "Email is required";
  }

  const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

  if (!emailRegex.test(email)) {
    return "Email ID is not valid";
  }

  /* =======================
     PASSWORD VALIDATION (INDIVIDUAL)
  ======================= */
  if (!password) {
    return "Password is required";
  }

  if (password.length < 8) {
    return "Password must be at least 8 characters long";
  }

  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter";
  }

  if (!/[a-z]/.test(password)) {
    return "Password must contain at least one lowercase letter";
  }

  if (!/\d/.test(password)) {
    return "Password must contain at least one number";
  }

  if (!/[@$!%*?&]/.test(password)) {
    return "Password must contain at least one special character (@$!%*?&)";
  }

  /* =======================
     ALL VALID
  ======================= */
  return null;
};

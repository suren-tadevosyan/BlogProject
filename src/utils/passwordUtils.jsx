export const calculatePasswordStrength = (password) => {
  const length = password.length;
  if (length < 8) {
    return 0;
  } else if (length < 12) {
    return 1;
  } else {
    return 2;
  }
};
export const getStrengthText = (strength) => {
  switch (strength) {
    case 0:
      return "Weak";
    case 1:
      return "Medium";
    case 2:
      return "Strong";
    default:
      return "";
  }
};
export const getStrengthColor = (strength) => {
  const colors = ["red", "orange", "green"];
  return colors[strength];
};

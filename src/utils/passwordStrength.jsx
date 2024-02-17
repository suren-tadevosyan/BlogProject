import React from "react";
import { motion } from "framer-motion";
import { getStrengthText, getStrengthColor } from "./passwordUtils";
import "../style/login.css";

const PasswordStrengthIndicator = ({
  passwordStrength,
  isUppercasePresent,
  isLowercasePresent,
  isNumberPresent,
  isSpecialCharPresent,
  className,
}) => (
  <motion.div // Wrap the component with motion.div
    initial={{ opacity: 0, y: -20 }} // Initial animation values
    animate={{ opacity: 1, y: 0 }} // Animation to apply when component appears
    transition={{ duration: 0.3 }} // Duration of the animation
    className={`password-feedback-popup ${className}`} // Add className prop
  >
    <div className="password-strength-indicator">
      <div
        className="strength-bar"
        style={{
          width: `${(passwordStrength + 1) * 33.33}%`,
          backgroundColor: getStrengthColor(passwordStrength),
        }}
      ></div>
    </div>
    <p className="password-feedback">
      <span
        style={{
          fontWeight: "bold",
          color: getStrengthColor(passwordStrength),
        }}
      >
        Password Strength: {getStrengthText(passwordStrength)}
      </span>
      <br />
      Password must contain at least 8 characters, including one uppercase
      letter, one lowercase letter, one number, and one special character.
    </p>

    <ul className="password-requirements">
      <li className={isUppercasePresent ? "" : "redChar"}>
        <input type="checkbox" checked={isUppercasePresent} readOnly />
        Contains at least one uppercase letter
      </li>
      <li className={isLowercasePresent ? "" : "redChar"}>
        <input type="checkbox" checked={isLowercasePresent} readOnly />
        Contains at least one lowercase letter
      </li>
      <li className={isNumberPresent ? "" : "redChar"}>
        <input type="checkbox" checked={isNumberPresent} readOnly />
        Contains at least one number
      </li>
      <li className={isSpecialCharPresent ? "" : "redChar"}>
        <input type="checkbox" checked={isSpecialCharPresent} readOnly />
        Contains at least one special character
      </li>
    </ul>
  </motion.div>
);

export default PasswordStrengthIndicator;

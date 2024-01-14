import React from "react";
import { calculatePasswordStrength, getStrengthText, getStrengthColor } from "./passwordUtils"
import "../style/login.css"

const PasswordStrengthIndicator = ({
  passwordStrength,
  isUppercasePresent,
  isLowercasePresent,
  isNumberPresent,
  isSpecialCharPresent,
  className,
  
}) => (
  <div className="password-feedback-popup">
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
      <li>
        <input type="checkbox" checked={!!isUppercasePresent} readOnly />
        Contains at least one uppercase letter
      </li>
      <li>
        <input type="checkbox" checked={isLowercasePresent} readOnly />
        Contains at least one lowercase letter
      </li>
      <li>
        <input type="checkbox" checked={isNumberPresent} readOnly />
        Contains at least one number
      </li>
      <li>
        <input type="checkbox" checked={isSpecialCharPresent} readOnly />
        Contains at least one special character
      </li>
    </ul>
  </div>
);

export default PasswordStrengthIndicator;

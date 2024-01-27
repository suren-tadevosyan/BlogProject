import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const Form = ({
  label,
  type,
  id,
  name,
  value,
  onChange,
  required,
  onFocus,
  onBlur,
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleToggleVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  return (
    <div className="form-group">
      <label htmlFor={id}>{label}:</label>
      <div className="password-input-container">
        <input
          type={type === "password" && isPasswordVisible ? "text" : type}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          required={required}
        />
        {type === "password" && (
          <button
            type="button"
            className="toggle-button"
            onClick={handleToggleVisibility}
            onFocus={onFocus}
          >
            <FontAwesomeIcon icon={isPasswordVisible ? faEye : faEyeSlash} />
          </button>
        )}
      </div>
    </div>
  );
};

export default Form;

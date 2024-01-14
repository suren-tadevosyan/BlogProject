import React from "react";
import { useNavigate } from "react-router-dom";

export const ErrorModal = ({ message, onClose, visible }) => {
  const navigate = useNavigate();
  if (!visible) {
    return null;
  }

  const login  = 
  () => {
    navigate("/login")
  }
  return (
    <div className="error-modal">
      <p>{message}</p>
     <div>
     <button onClick={onClose}>Close</button>
      <button onClick={login}>Login</button>
     </div>

    </div>
  );
};

export const ErrorMessage = ({ message }) => (
  <p style={{ color: "red", margin: "5px 0" }}>{message}</p>
);


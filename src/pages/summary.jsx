import React from "react";
import { useSelector } from "react-redux";

const Summary = () => {
  const { mode } = useSelector((state) => state.theme);

  return (
    <div className={`summary ${mode === "dark" ? "dark" : ""}`}>
      <div></div>
    </div>
  );
};

export default Summary;

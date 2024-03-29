import React from "react";
import { TailSpin } from "react-loader-spinner";
import "../style/loader.css";

const LoadingSpinner = ({ className }) => {
  return (
    <div className={className}>
      <TailSpin color="#00BFFF" height={50} width={50} />
    </div>
  );
};

export default LoadingSpinner;

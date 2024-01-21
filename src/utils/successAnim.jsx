import React from "react";
import Lottie from "react-lottie";
import animationData from "../images/success.json"; // Replace with the correct path
import deletAnim from "../images/delete.json"

const SuccessAnimation = () => {
  const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return <Lottie options={defaultOptions} height={60} width={60} />;
};


export const DeleteAnimation = () => {
    const defaultOptions = {
      loop: false,
      autoplay: true,
      animationData: deletAnim,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid slice",
      },
    };
  
    return <Lottie options={defaultOptions} height={80} width={80} />;
  };

export default SuccessAnimation;

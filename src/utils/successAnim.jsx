import React from "react";
import Lottie from "react-lottie";
import animationData from "../images/success.json"; // Replace with the correct path
import deletAnim from "../images/delete.json";
import welcomeAnim from "../images/hello.json";
import byAnim from "../images/goodby.json";

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

export const WelcomeAnimation = () => {
  const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: welcomeAnim,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return <Lottie options={defaultOptions} height={500} width={500} />;
};

export const ByAnimation = () => {
  const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: byAnim,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return <Lottie options={defaultOptions} height={500} width={500} />;
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

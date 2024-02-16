import React from "react";
import Lottie from "react-lottie";
import animationData from "../images/success.json";
import deletAnim from "../images/delete.json";
import welcomeAnim from "../images/hello.json";
import byAnim from "../images/goodby.json";
import contactAnim from "../images/contactAnim.json";
import NotFound from "../images/notFound.json";
import onlineAnim from "../images/online.json";

const SuccessAnimation = () => {
  const defaultOptions = {
    loop: true,
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
    loop: true,
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
    loop: true,
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
    loop: true,
    autoplay: true,
    animationData: deletAnim,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return <Lottie options={defaultOptions} height={80} width={80} />;
};

export const NotFoundAnimation = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: NotFound,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return <Lottie options={defaultOptions} height={500} width={500} />;
};

export const ContactAnimation = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: contactAnim,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return <Lottie options={defaultOptions} height={200} width={200} />;
};

export const OnlineAnimation = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: onlineAnim,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return <Lottie options={defaultOptions} height={30} width={30} />;
};

export default SuccessAnimation;

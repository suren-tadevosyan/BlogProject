// VideoPlayer.js
import React, { useRef, useEffect } from "react";

const VideoPlayer = ({ videoSource }) => {
  const videoRef = useRef(null);

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    const transitionPoint = 0.2; // Adjust this value to control the transition point

    if (video) {
      const currentTime = video.currentTime;
      const duration = video.duration;

      if (currentTime > duration - transitionPoint) {
        // If near the end, smoothly transition to the beginning
        video.currentTime = transitionPoint;
      } else if (currentTime < transitionPoint) {
        // If near the beginning, smoothly transition to the end
        video.currentTime = duration - transitionPoint;
      }
    }
  };

  const handleVideoEnded = () => {
    // Smoothly transition from the end back to the beginning
    const video = videoRef.current;
    if (video) {
      video.currentTime = 0.1; // Set a small value to avoid issues in some browsers
      video.play();
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.addEventListener("timeupdate", handleTimeUpdate);
      video.addEventListener("ended", handleVideoEnded);
    }

    return () => {
      if (video) {
        video.removeEventListener("timeupdate", handleTimeUpdate);
        video.removeEventListener("ended", handleVideoEnded);
      }
    };
  }, []);

  return (
    <video
      className="fullscreen-video"
      ref={videoRef}
      autoPlay
      muted
      id="video-background"
    >
      <source src={videoSource} type="video/mp4" />
    </video>
  );
};

export default VideoPlayer;

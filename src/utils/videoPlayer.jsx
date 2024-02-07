// VideoPlayer.js
import React, { useRef, useEffect } from "react";

const VideoPlayer = ({ videoSource }) => {
  const videoRef = useRef(null);
  useEffect(() => {
    // Ensure the video loops infinitely
    videoRef.current.addEventListener("ended", () => {
      videoRef.current.play();
    });
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

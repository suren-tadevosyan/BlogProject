import "./landing.css";
import React from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import ActiveUsersList from "../../utils/activeUsersList";
import VideoPlayer from "../../utils/videoPlayer";
import IMG from "../../images/encryption.webm";

const LandingPage = () => {
  const { mode } = useSelector((state) => state.theme);
  return (
    <div className={mode === "dark" ? "landing-page " : "landing-page "}>
      <VideoPlayer videoSource={IMG} />
      <motion.div
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="hero-section"
      >
        <h1>Welcome to My App</h1>
        <p>Explore and Connect</p>
      </motion.div>

      <div className="right-section">
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="online-users"
        >
          <h2>Online Users</h2>
          <ActiveUsersList />
        </motion.div>
      </div>
    </div>
  );
};

export default LandingPage;

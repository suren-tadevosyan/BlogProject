import IMG from "../../images/stars.mp4";
import "./landing.css";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import VideoPlayer from "../../utils/videoPlayer";
import { selectUserPosts } from "../../redux/slices/postSlices";
import { Grid,  Typography } from "@mui/material";
import "./landing.css";
const LandingPage = () => {
  const { mode } = useSelector((state) => state.theme);
  const userPosts = useSelector(selectUserPosts);
  const [displayedPosts, setDisplayedPosts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % userPosts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [userPosts.length]);

  useEffect(() => {
    const updateDisplayedPosts = () => {
      if (userPosts.length === 0) {
        setDisplayedPosts([]);
        return;
      }
      const nextPosts = [
        userPosts[currentIndex],
        userPosts[(currentIndex + 1) % userPosts.length],
        userPosts[(currentIndex + 2) % userPosts.length],
      ];
      setDisplayedPosts(nextPosts);
    };
    updateDisplayedPosts();
  }, [currentIndex, userPosts]);

  return (
    <div className={mode === "dark" ? "landing-page" : "landing-page "}>
      <VideoPlayer videoSource={IMG} />
      <motion.div
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="hero-section"
      >
        <h1>Welcome to Space Blog</h1>
        <p> Safeguarding Your Information Beyond Earth</p>
      </motion.div>

      <div className="post-view">
        <p className="title">
          Stay Connected: Check Out Our Latest Updates!
        </p>
        <Grid container spacing={3} className="latest-posts">
          {displayedPosts.map((post, index) => (
            <Grid item xs={12} md={4} key={index}>
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                style={{ width: "100%" }}
              >
                <Typography variant="h5" component="h2" className="post-title">
                  {post.username}
                </Typography>
                <Typography
                  variant="body1"
                  component="p"
                  className="post-content-landing"
                >
                  {post.content.length > 60
                    ? `${post.content.slice(0, 60)}...`
                    : post.content}

                  {post.imageUrl && <img src={post.imageUrl} alt="" />}
                </Typography>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </div>
    </div>
  );
};

export default LandingPage;

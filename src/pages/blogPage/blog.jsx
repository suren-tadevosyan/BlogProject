import { useEffect, useState } from "react";
import PostList from "../postList";
import { auth } from "../../firebase";
import LoadingSpinner from "../../utils/loading";
import { useSelector } from "react-redux";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import "./blog.css";
import ScrollToTopButton from "../../utils/scrollTop";
import IMG from "../../images/blackhole.webm";
import VideoPlayer from "../../utils/videoPlayer";

function Motion({ postCount }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);

  useEffect(() => {
    const animation = animate(count, postCount, {
      duration: 3,
    });

    return () => animation.pause();
  }, [postCount, count]);

  return <motion.h1>{rounded}</motion.h1>;
}

const Blog = () => {
  const { id } = useSelector((state) => state.user);
  const [user, setUser] = useState(null);
  const { mode } = useSelector((state) => state.theme);
  const { postCounts } = useSelector((state) => state.posts);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className={mode === "dark" ? "profile " : "profile"}>
      <VideoPlayer videoSource={IMG} />
      <div className="post-count">
        <div>
          <p>Today's Posts -  </p> <Motion postCount={postCounts.today} />
        </div>
        <div>
          <p>This Week's Posts - </p> <Motion postCount={postCounts.thisWeek} />
        </div>
        <div>
          <p>Total Posts- </p> <Motion postCount={postCounts.total} />
        </div>
      </div>
      <PostList likeID={id} currentUserIDForDelete={user?.uid} />
      <ScrollToTopButton />
    </div>
  );
};

export default Blog;

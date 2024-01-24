import { useEffect, useState } from "react";
import PostList from "./postList";
import { auth } from "../firebase";
import LoadingSpinner from "../utils/loading";
import { useSelector } from "react-redux";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import "../style/blog.css";
import ScrollToTopButton from "../utils/scrollTop";

const Blog = () => {
  const [user, setUser] = useState(null);
  const { mode } = useSelector((state) => state.theme);
  const [isLoading, setIsLoading] = useState(true);
  const [postCount, setPostCount] = useState(0);
  const [todayPosts, setTodayPosts] = useState(0);
  const [thisWeekPosts, setThisWeekPosts] = useState(0);

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

  function Motion({ postCount }) {
    const count = useMotionValue(0);
    const rounded = useTransform(count, Math.round);

    useEffect(() => {
      const animation = animate(count, postCount, {
        duration: 3,
      });

      return () => animation.pause();
    }, [postCount]);

    return <motion.h1>{rounded}</motion.h1>;
  }

  return (
    <div className={mode === "dark" ? "profile dark" : "profile"}>
      <div className="post-count">
        <div>
          <p>Today Posts- </p> <Motion postCount={todayPosts} />
        </div>
        <div>
          <p>This Week Posts- </p> <Motion postCount={thisWeekPosts} />
        </div>
        <div>
          <p>Total Posts- </p> <Motion postCount={postCount} />
        </div>
      </div>
      <PostList
        currentUserIDForDelete={user?.uid}
        setPostCount={setPostCount}
        setTodayPosts={setTodayPosts}
        setThisWeekPosts={setThisWeekPosts}
      />
      <ScrollToTopButton />
    </div>
  );
};

export default Blog;

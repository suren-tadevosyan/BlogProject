import React, { useEffect, useState } from "react";
import PostForm from "./postForm";

import { auth } from "../firebase";
import "../style/post.css";
import LoadingSpinner from "../utils/loading";

const Post = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(() => {
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="post-div">
      <PostForm />
    </div>
  );
};

export default Post;

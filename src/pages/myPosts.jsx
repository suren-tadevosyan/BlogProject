import React, { useEffect, useState } from "react";
import PostForm from "./postForm";
import PostList from "./postList";
import { auth } from "../firebase";


import LoadingSpinner from "../utils/loading";

const MyPosts = () => {
  const [isDataUpdated, setIsDataUpdated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDataUpdate = () => {
    console.log("Data updated");
    setIsDataUpdated((prev) => !prev);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="post-div">
      <PostList
        // isDataUpdated={isDataUpdated}
        currentUserID={user?.uid}
        currentUserIDForDelete={user?.uid}
      />
    </div>
  );
};

export default MyPosts;

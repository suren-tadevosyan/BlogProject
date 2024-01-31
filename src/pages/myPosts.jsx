// MyPosts.js

import React, { useEffect, useState } from "react";
import PostList from "./postList";
import { auth } from "../firebase";
import LoadingSpinner from "../utils/loading";
import { deleteAllPostsForUser } from "../services/postServices"; // Import the new function
import { useSelector } from "react-redux";

const MyPosts = () => {
  const [isDataUpdated, setIsDataUpdated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const {id} = useSelector((state) => state.user)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);


  // console.log(user?.uid);
  // console.log(id);


  const handleDataUpdate = () => {
    console.log("Data updated");
    setIsDataUpdated((prev) => !prev);
  };

  const handleDeleteAll = async () => {
    try {
      await deleteAllPostsForUser(id);
      handleDataUpdate();
    } catch (error) {
      console.error("Error deleting all posts:", error);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="post-div">
      <button onClick={handleDeleteAll}>Delete All Posts</button>
      <PostList
        currentUserID={id}
        currentUserIDForDelete={id}
        isDataUpdated={isDataUpdated}
      />
    </div>
  );
};

export default MyPosts;

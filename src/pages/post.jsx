import React, { useEffect, useState } from "react";
import PostForm from "./postForm";
import PostList from "./postList";
import { auth } from "../firebase";

const Post = () => {
  const [isDataUpdated, setIsDataUpdated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Assuming you have some authentication logic here to set the user
    // For example, using Firebase authentication:
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
    return <p>Loading...</p>; // You can replace this with a spinner or any loading indicator
  }

  return (
    <div>
      <PostForm onDataUpdated={handleDataUpdate} />
      <PostList
        isDataUpdated={isDataUpdated}
        currentUserID={user?.uid}
        currentUserIDForDelete={user?.uid}
      />
      ;
    </div>
  );
};

export default Post;

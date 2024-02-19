import React, { useEffect, useState } from "react";
import PostList from "../postList";
import { auth } from "../../firebase";
import LoadingSpinner from "../../utils/loading";
import { deleteAllPostsForUser } from "../../services/postServices";
import { useSelector } from "react-redux";
import "./myPosts.css";
import { DeleteAnimation } from "../../utils/successAnim";

import StarsCanvas from "../../utils/starCanvas/starCanvas.tsx";

const MyPosts = () => {
  const [isDataUpdated, setIsDataUpdated] = useState(false);

  const [deleting, setDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useSelector((state) => state.user);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(() => {
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let timer;
    if (deleting) {
      timer = setTimeout(() => {
        setDeleting(false);
      }, 3000);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [deleting]);

  const handleDataUpdate = () => {
    console.log("Data updated");
    setIsDataUpdated((prev) => !prev);
  };

  const handleDeleteAll = async () => {
    try {
      setDeleting(true);
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
    <div className="posts-div">
      <div className="starAnim">
        <StarsCanvas />
      </div>
      <button onClick={handleDeleteAll} className="delete-all bn5">
        Delete All Posts
      </button>
      <PostList
        currentUserID={id}
        currentUserIDForDelete={id}
        isDataUpdated={isDataUpdated}
      />
      {deleting && (
        <div className="modal-overlay">
          <div className="delete-all-anim">
            <DeleteAnimation />
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPosts;

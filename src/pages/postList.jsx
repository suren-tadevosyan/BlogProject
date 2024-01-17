// components/PostList.js
import React, { useEffect, useState } from "react";
import { getUserPostsFromFirestore } from "../services/postServices";
import PostCard from "../utils/postCard";
import "../style/postCard.css";

const PostList = ({ isDataUpdated, currentUserID , currentUserIDForDelete }) => {
  const [userPosts, setUserPosts] = useState([]);


    const fetchUserPosts = async () => {
      try {
        // Get user posts from localStorage
        const storedUserPosts =
          JSON.parse(localStorage.getItem("userPosts")) || [];

        if (storedUserPosts.length > 0) {
          // Use stored posts as the initial state
          setUserPosts(storedUserPosts);
        }

        // Fetch the latest user posts from Firestore
        const latestPosts = await getUserPostsFromFirestore();

        // Update state only if there are new posts or if localStorage is empty
        if (
          latestPosts?.allUserPosts?.length > 0 ||
          storedUserPosts.length === 0
        ) {
          const sortedPosts = latestPosts.allUserPosts.sort(
            (a, b) => b.timestamp - a.timestamp
          );
          setUserPosts(latestPosts.allUserPosts);

          // Save the latest user posts in localStorage
          if (latestPosts?.allUserPosts) {
            localStorage.setItem(
              "userPosts",
              JSON.stringify(latestPosts.allUserPosts)
            );
          }
        }
      } catch (error) {
        console.error("Error fetching or storing user posts:", error);
      }
    };

  

  useEffect(() => {
    fetchUserPosts();
  }, [isDataUpdated]);

  const filteredPosts = currentUserID
    ? userPosts.filter((post) => post.userID === currentUserID)
    : userPosts;

  const sortedPosts = filteredPosts.sort((a, b) => b.timestamp - a.timestamp);
  return (
    <div>
      <ul>
        {sortedPosts &&
          sortedPosts.map((post) => (
            <PostCard
              key={post.id || `${post.username}-${post.content}`}
              post={post}
              currentUserID={currentUserID}
              currentUserIDForDelete ={currentUserIDForDelete }
              onDataUpdated={() => fetchUserPosts()}
            />
          ))}
      </ul>
    </div>
  );
};

export default PostList;

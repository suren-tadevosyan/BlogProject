// components/PostList.js
import React, { useEffect, useState } from "react";
import { getUserPostsFromFirestore } from "../services/postServices";
import PostCard from "../utils/postCard";
import "../style/postCard.css";

const PostList = ({ isDataUpdated, currentUserID, currentUserIDForDelete }) => {
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
    formatTimestamp();
  }, [isDataUpdated]);

  const filteredPosts = currentUserID
    ? userPosts.filter((post) => post.userID === currentUserID)
    : userPosts;
  const sortedPosts = filteredPosts.sort((a, b) => b.timestamp - a.timestamp);

  const formatTimestamp = (timestamp) => {
    const postDate = new Date(timestamp);
    const currentDate = new Date();

    const postDay = postDate.getDate();
    const postMonth = postDate.getMonth() + 1;
    const postYear = postDate.getFullYear();

    const postHour = postDate.getHours();
    const postMinute = postDate.getMinutes();

    if (
      postDay === currentDate.getDate() &&
      postMonth === currentDate.getMonth() + 1 &&
      postYear === currentDate.getFullYear()
    ) {
      const formattedTime = `${postHour}:${
        postMinute < 10 ? "0" : ""
      }${postMinute}`;
      return formattedTime;
    } else {
      const formattedDate = `${postDay}/${postMonth}/${postYear}`;
      return formattedDate;
    }
  };

  return (
    <div>
      <ul>
        {sortedPosts &&
          sortedPosts.map((post) => (
            <PostCard
              key={post.id || `${post.username}-${post.content}`}
              post={post}
              date={formatTimestamp(post.timestamp)}
              currentUserID={currentUserID}
              currentUserIDForDelete={currentUserIDForDelete}
              onDataUpdated={() => fetchUserPosts()}
            />
          ))}
      </ul>
    </div>
  );
};

export default PostList;

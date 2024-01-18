import React, { useEffect, useState } from "react";
import { getUserPostsFromFirestore } from "../services/postServices";
import PostCard from "../utils/postCard";
import "../style/postCard.css";
import { formatTimestamp } from "../utils/formatDate";

const PostList = ({ isDataUpdated, currentUserID, currentUserIDForDelete }) => {
  const [userPosts, setUserPosts] = useState([]);

  const fetchUserPosts = async () => {
    try {
      const storedUserPosts =
        JSON.parse(localStorage.getItem("userPosts")) || [];

      if (storedUserPosts.length > 0) {
        setUserPosts(storedUserPosts);
      }

      const latestPosts = await getUserPostsFromFirestore();

      if (
        latestPosts?.allUserPosts?.length > 0 ||
        storedUserPosts.length === 0
      ) {
        const sortedPosts = latestPosts.allUserPosts.sort(
          (a, b) => b.timestamp - a.timestamp
        );
        setUserPosts(latestPosts.allUserPosts);

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

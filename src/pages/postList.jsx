import React, { useEffect, useState } from "react";
import {
  getUserPostsFromFirestore,
  likePostInFirestore,
} from "../services/postServices";
import PostCard from "../utils/postCard";
import "../style/postCard.css";
import { formatTimestamp } from "../utils/formatDate";
import { filterPostsByWeek, isSameDay } from "../utils/dateCheck";
import { useDispatch } from "react-redux";
import {
  getUserPostsSuccess,
  likePost,
  setPostCounts,
} from "../redux/slices/postSlices";

const PostList = ({
  isDataUpdated,
  currentUserID,
  currentUserIDForDelete,
  likeID,
}) => {
  const dispatch = useDispatch();
  const [userPosts, setUserPosts] = useState([]);

  const handleLike = async (postId) => {
    try {
      // Perform logic to like the post in Firestore
      await likePostInFirestore(postId, likeID);

      // Dispatch an action to update the state
      dispatch(likePost({ postId, userId: currentUserID }));
    } catch (error) {
      console.error("Error handling like:", error);
      // Handle error appropriately, e.g., show a notification to the user.
    }
  };

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
        const postsWithSerializableTimestamp = latestPosts.allUserPosts.map(
          (post) => ({
            ...post,
            timestamp:
              post.timestamp instanceof Date
                ? post.timestamp.toISOString()
                : new Date(post.timestamp).toISOString(),
          })
        );

        setUserPosts(postsWithSerializableTimestamp);

        if (latestPosts?.allUserPosts) {
          dispatch(getUserPostsSuccess(postsWithSerializableTimestamp));
          // localStorage.setItem(
          //   "userPosts",
          //   JSON.stringify(latestPosts.allUserPosts)
          // );
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

  useEffect(() => {
    const today = new Date();
    const postsFromCurrentDay = userPosts.filter((post) =>
      isSameDay(new Date(post.timestamp), today)
    );
    const postsFromCurrentWeek = filterPostsByWeek(userPosts);
    const totalPosts = userPosts.length;

    dispatch(
      setPostCounts({
        today: postsFromCurrentDay.length,
        thisWeek: postsFromCurrentWeek.length,
        total: totalPosts,
      })
    );
  }, [userPosts]);

  const filteredPosts = currentUserID
    ? userPosts.filter((post) => post.userID === currentUserID)
    : userPosts;
  const sortedPosts = filteredPosts.sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="post-cards-container">
      {sortedPosts &&
        sortedPosts.map((post, index) => (
          <PostCard
            key={post.id || `${post.username}-${post.content}`}
            post={post}
            date={formatTimestamp(post.timestamp)}
            currentUserID={currentUserID}
            currentUserIDForDelete={currentUserIDForDelete}
            onDataUpdated={() => fetchUserPosts()}
            index={index}
            onLike={() => handleLike(post.id)}
          />
        ))}
    </div>
  );
};

export default PostList;

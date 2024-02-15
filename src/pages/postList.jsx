import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";
import {
  getUserPostsFromFirestore,
  likePostInFirestore,
} from "../services/postServices";
import PostCard from "../utils/postCard/postCard";
import { formatTimestamp } from "../utils/formatDate";
import { filterPostsByWeek, isSameDay } from "../utils/dateCheck";
import { getUserPostsSuccess, setPostCounts } from "../redux/slices/postSlices";

const PostList = ({
  isDataUpdated,
  currentUserID,
  currentUserIDForDelete,
  likeID,
  setCount,
  setName,
}) => {
  const dispatch = useDispatch();
  const [userPosts, setUserPosts] = useState([]);

  const [endIndex, setEndIndex] = useState(3);

  const handleLike = useCallback(
    async (postId) => {
      try {
        await likePostInFirestore(postId, likeID);
      } catch (error) {
        console.error("Error handling like:", error);
      }
    },
    [likeID]
  );

  const fetchUserPosts = useCallback(async () => {
    try {
      const latestPosts = await getUserPostsFromFirestore();
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
      dispatch(getUserPostsSuccess(postsWithSerializableTimestamp));

      if (latestPosts.allUserPosts.length > 0) {
        localStorage.setItem(
          "userPosts",
          JSON.stringify(postsWithSerializableTimestamp)
        );
      }
    } catch (error) {
      console.error("Error fetching or storing user posts:", error);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchUserPosts();
    formatTimestamp();
  }, [isDataUpdated, fetchUserPosts]);

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
  }, [userPosts, dispatch]);

  const filteredPosts = useMemo(
    () =>
      currentUserID
        ? userPosts.filter((post) => post.userID === currentUserID)
        : userPosts,
    [userPosts, currentUserID]
  );

  const sortedPosts = useMemo(
    () =>
      filteredPosts
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, endIndex),
    [filteredPosts, endIndex]
  );

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop ===
      document.documentElement.offsetHeight
    ) {
      setEndIndex((prevIndex) => prevIndex + 1);
    }
  }, [endIndex]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  {
    setCount && setCount(filteredPosts.length);
  }

  {
    setName &&
      (filteredPosts[0] ? setName(filteredPosts[0].username) : setName(""));
  }

  return (
    <div className="post-cards-container">
      {sortedPosts.map((post, index) => (
        <PostCard
          key={post.id || `${post.username}-${post.content}`}
          post={post}
          date={formatTimestamp(post.timestamp)}
          currentUserID={currentUserID}
          currentUserIDForDelete={currentUserIDForDelete}
          onDataUpdated={fetchUserPosts}
          index={index}
          onLike={() => handleLike(post.id)}
        />
      ))}
    </div>
  );
};

export default PostList;

import React from "react";
import { deletePostFromFirestore } from "../services/postServices";

const getRandomColor = (str) => {
  const hash = str.split("").reduce((acc, char) => char.charCodeAt(0) + acc, 1);
  const color = `hsl(${hash % 300}, 50%, 50%)`;

  return color;
};

const PostCard = ({
  post,
  currentUserID,
  onDataUpdated,
  currentUserIDForDelete,
  date,
}) => {
  const backgroundColor = getRandomColor(post.userID);

  const handleDelete = async () => {
    try {
      if (post.userID === currentUserID) {
        await deletePostFromFirestore(post.id);

        onDataUpdated();
      } else {
        console.log("You can only delete your own posts.");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <div className="post-card" style={{ backgroundColor }}>
      <div className="post-user">
        <div className="post-content">
          <strong>{post.username}</strong>
          <span>
            <div className="post-date">
              <strong>Date:{date}</strong>
            </div>
          </span>
          {post.content}
        </div>

        <div className="delete-button">
          {post.userID === currentUserIDForDelete && (
            <button onClick={handleDelete}>Delete</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostCard;

import React from "react";
import { deletePostFromFirestore } from "../services/postServices";

const getRandomColor = (str) => {
  // Generate a random color based on the user's unique identifier (e.g., user ID)
  const hash = str.split("").reduce((acc, char) => char.charCodeAt(0) + acc, 1);
  const color = `hsl(${hash % 300}, 50%, 50%)`; // Using HSL color space

  return color;
};
const PostCard = ({ post, currentUserID, onDataUpdated ,currentUserIDForDelete }) => {
  const backgroundColor = getRandomColor(post.userID);

  const handleDelete = async () => {
    try {
      // Check if the post belongs to the current user
      if (post.userID === currentUserID) {
        // Delete the post from Firestore
        await deletePostFromFirestore(post.id);

        // Update the state to trigger a re-render of the PostList component
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
        <div>
          <strong>{post.username}</strong>: {post.content}
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

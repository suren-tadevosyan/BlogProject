// CommentSection.js
import React, { useState, useEffect } from "react";
import {
  addCommentToPost,
  getCommentsForPost,
} from "../../services/postServices";
import { useSelector } from "react-redux";

const CommentSection = ({ post, onDataUpdated }) => {
  const [commentText, setCommentText] = useState(""); // Define commentText state
  const [comments, setComments] = useState([]);
  const { name } = useSelector((state) => state.user); // Define name using useSelector

  useEffect(() => {
    const fetchComments = async () => {
      const postComments = await getCommentsForPost(post.id);
      console.log(postComments.username);
      // You might want to handle the case when postComments.username is undefined/null
      setComments(postComments.comments);
    };
    fetchComments();
  }, [post.id]);

  const handleAddComment = async () => {
    if (commentText.trim() === "") return;
    try {
      await addCommentToPost(post.id, commentText, name); // pass name instead of 'name'
      setCommentText(""); // Clear comment input
      onDataUpdated();
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <div>
      {/* <div className="comments-section">
        {comments.map((comment, index) => (
          <div key={index} className="comment">
            <span>{comment.author}:</span>
            <span>{comment.text}</span>
          </div>
        ))}
      </div> */}
      <div className="add-comment-section">
        <input
          type="text"
          placeholder="Add a comment..."
          value={commentText}
          className={commentText ? "active" : ""}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <button className="bn5" onClick={handleAddComment}>
          Comment
        </button>
      </div>
    </div>
  );
};

export default CommentSection;

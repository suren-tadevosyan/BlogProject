import React, { useState, useEffect } from "react";
import {
  addCommentToPost,
  deleteCommentFromPost,
  getCommentsForPost,
} from "../../services/postServices";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

export const CommentList = ({ post }) => {
  const [comments, setComments] = useState([]);
  const [containerHeight, setContainerHeight] = useState(0);
  const { name } = useSelector((state) => state.user);

  const fetchComments = async () => {
    const postComments = await getCommentsForPost(post.id);
    setComments(postComments.comments);

    setContainerHeight(postComments.comments.length * 50);
  };

  const fetchCommentsWithInterval = () => {
    fetchComments();
    setInterval(fetchComments, 1000);
  };

  fetchCommentsWithInterval();

  useEffect(() => {
    fetchComments();
  }, [post.id]);

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteCommentFromPost(post.id, commentId);

      fetchComments();
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  return (
    <motion.div
      style={{ overflow: "hidden", transition: "height 0.5s" }}
      initial={{ height: 0 }}
      animate={{ height: containerHeight }}
      className="comment"
    >
      {comments.map((comment, index) => (
        <div
          key={index}
          style={{
            marginTop: "10px",
            padding: "10px",
            background: "#4b79a1",
            borderRadius: "5px",
          }}
        >
          <span style={{ fontWeight: "bold" }}>{comment.author}:</span>
          <span style={{ marginLeft: "5px" }}>{comment.text}</span>
          {comment.author === name && (
            <button onClick={() => handleDeleteComment(comment.id)}>
              Delete
            </button>
          )}
        </div>
      ))}
    </motion.div>
  );
};

const CommentSection = ({ post, toggleComments }) => {
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const { name } = useSelector((state) => state.user);

  const handleAddComment = async () => {
    if (commentText.trim() === "") return;
    try {
      await addCommentToPost(post.id, commentText, name);
      setCommentText("");

      fetchComments();
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const fetchComments = async () => {
    const postComments = await getCommentsForPost(post.id);
    setComments(postComments.comments);
  };

  const fetchCommentsWithInterval = () => {
    fetchComments();
    setInterval(fetchComments, 1000);
  };

  fetchCommentsWithInterval();
  useEffect(() => {
    fetchComments();
  }, [post.id]);

  return (
    <div className="comments-section">
      <div className="comment-count" onClick={toggleComments}>
        {comments.length === 1 ? "Comment" : "Comments"} ({comments.length})
      </div>

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


import React, { useState, useEffect } from "react";
import {
  addCommentToPost,
  getCommentsForPost,
} from "../../services/postServices";
import { useSelector } from "react-redux";

const CommentSection = ({ post, onDataUpdated }) => {
  const [commentText, setCommentText] = useState(""); 
  const [comments, setComments] = useState([]);
  const { name } = useSelector((state) => state.user); 
  useEffect(() => {
    const fetchComments = async () => {
      const postComments = await getCommentsForPost(post.id);
   

      setComments(postComments.comments);
    };
    fetchComments();
  }, [post.id]);

  const handleAddComment = async () => {
    if (commentText.trim() === "") return;
    try {
      await addCommentToPost(post.id, commentText, name); 
      setCommentText("");
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

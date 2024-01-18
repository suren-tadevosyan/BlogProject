import React, { useState } from "react";
import { useDispatch,useSelector } from "react-redux";
import { addPost } from "../redux/actions/postActions";
import "../style/post.css";
import { toggleTheme } from "../redux/slices/theme";

const PostForm = ({ onDataUpdated }) => {
  const dispatch = useDispatch();
  const [content, setContent] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { mode } = useSelector((state) => state.theme);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (content.trim() === "") {
      setErrorMessage("Post content cannot be empty");
      return;
    }

    dispatch(addPost(content));
    setContent("");
    onDataUpdated();
    setErrorMessage("");
  };

  return (
    <div className={content ?"post-area idea" : "post-area"}>
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
        
        />
        {errorMessage && <p>{errorMessage}</p>}
        <button
          type="submit"
    
        >
          Add Post
        </button>
      </form>
    </div>
  );
};

export default PostForm;

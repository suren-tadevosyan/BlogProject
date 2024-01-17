import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addPost } from "../redux/actions/postActions";

const PostForm = ({ onDataUpdated }) => {
  const dispatch = useDispatch();
  const [content, setContent] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addPost(content));
    setContent("");
    onDataUpdated();
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea value={content} onChange={(e) => setContent(e.target.value)} />
      <button type="submit">Add Post</button>
    </form>
  );
};

export default PostForm;

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPost } from "../redux/actions/postActions";
import { toggleTheme } from "../redux/slices/theme";
import "../style/post.css";
import SuccessAnimation from "../utils/successAnim";

const PostForm = ({ onDataUpdated }) => {
  const dispatch = useDispatch();
  const [content, setContent] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
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
    setShowSuccessModal(true); // Set state to show the success modal
  };

  const contentClass = content ? "idea" : "";

  // Construct the class string
  const postAreaClasses = `post-area ${contentClass} ${
    mode === "dark" ? (content ? "ligth-mode" : "dark-mode") : ""
  }`;

  // useEffect to automatically hide the success modal after 2 seconds
  useEffect(() => {
    let timer;
    if (showSuccessModal) {
      timer = setTimeout(() => {
        setShowSuccessModal(false);
      }, 3000); // Adjust the duration as needed (in milliseconds)
    }
    return () => {
      clearTimeout(timer); // Clear the timer if the component unmounts
    };
  }, [showSuccessModal]);

  return (
    <div className={postAreaClasses}>
      <form onSubmit={handleSubmit}>
        <textarea
          className={mode === "dark" ? "text dtext" : "text"}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        {errorMessage && <p>{errorMessage}</p>}
        <button type="submit">Add Post</button>
      </form>

      {/* Conditional rendering of the success modal */}
      {showSuccessModal && (
        <div className="success-modal">
          <SuccessAnimation />
          Post added successfully!
        </div>
      )}
    </div>
  );
};

export default PostForm;

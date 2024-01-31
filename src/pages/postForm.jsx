import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPost } from "../redux/actions/postActions";
// import { toggleTheme } from "../redux/slices/theme";
import "../style/post.css";
import SuccessAnimation from "../utils/successAnim";
import TextGenerator from "./textGenerator";
import AutoCompleteTextarea from "../utils/autoComplete";

const PostForm = ({ onDataUpdated }) => {
  const dispatch = useDispatch();
  const [content, setContent] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const { mode } = useSelector((state) => state.theme);
  const [generatedText, setGeneratedText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (content.trim() === "") {
      setErrorMessage("Post content cannot be empty");
      return;
    }

    dispatch(addPost(content));
    setContent("");
    setGeneratedText("");
    onDataUpdated();
    setErrorMessage("");
    setShowSuccessModal(true);
  };

  const contentClass = content ? "idea" : "";

  const postAreaClasses = `post-area ${contentClass} ${
    mode === "dark" ? (content ? "ligth-mode" : "dark-mode") : ""
  }`;

  useEffect(() => {
    let timer;
    if (showSuccessModal) {
      timer = setTimeout(() => {
        setShowSuccessModal(false);
      }, 3000);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [showSuccessModal]);

  const updateContent = (newContent) => {
    setContent(newContent);
  };

  return (
    <div className={postAreaClasses}>
      <form onSubmit={handleSubmit}>
        <AutoCompleteTextarea
          className={mode === "dark" ? "text dtext" : "text"}
          text={content || generatedText}
          onTextChange={updateContent}
        />
        {/* <textarea
          className={mode === "dark" ? "text dtext" : "text"}
          value={content || generatedText}
          onChange={(e) => {
            setContent(e.target.value);
            updateContent(e.target.value);
          }}
        /> */}
        {errorMessage && <p>{errorMessage}</p>}
        <button type="submit">Add Post</button>
        <TextGenerator
          setGeneratedText={setGeneratedText}
          updateContent={updateContent}
        />
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

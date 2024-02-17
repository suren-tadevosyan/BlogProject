import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPost } from "../redux/actions/postActions";
import "../style/post.css";
import SuccessAnimation from "../utils/successAnim";
import TextGenerator from "./textGenerator";
import AutoCompleteTextarea from "../utils/autoComplete";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

const PostForm = () => {
  const dispatch = useDispatch();
  const [content, setContent] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const { mode } = useSelector((state) => state.theme);
  const [generatedText, setGeneratedText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (content.trim() === "") {
      setErrorMessage("Post content cannot be empty");
      return;
    }
    let imageUrl = "";
    if (imageFile) {
      const storage = getStorage();
      const storageRef = ref(storage, `images/${imageFile.name}`);
      await uploadBytes(storageRef, imageFile);
      imageUrl = await getDownloadURL(storageRef);
      console.log(imageUrl);
    }

    dispatch(addPost(content, imageUrl));
    setContent("");
    setGeneratedText("");
    setImageUrl("");
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

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImageUrl(URL.createObjectURL(file));
    setImageFile(file);
  };

  return (
    <div className={postAreaClasses}>
      <form onSubmit={handleSubmit}>
        <AutoCompleteTextarea
          className={mode === "dark" ? "text dtext" : "text"}
          text={content || generatedText}
          onTextChange={updateContent}
        />
        {imageUrl && (
          <div className="user-post-image">
            <img
              src={imageUrl}
              style={{ maxWidth: "100%" }}
              alt="UserPost"
            />
          </div>
        )}

        {errorMessage && <p>{errorMessage}</p>}
        <input
          type="file"
          className="imgInp"
          accept="image/*"
          onChange={handleImageUpload}
        />

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

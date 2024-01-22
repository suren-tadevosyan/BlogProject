import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { deletePostFromFirestore } from "../services/postServices";
import userPhoto from "../images/userMale.png";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { DeleteAnimation } from "./successAnim";

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
  index
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const backgroundColor = getRandomColor(post.userID);
  const [isOpen, setIsOpen] = useState(false);
  const [showReadMoreButton, setShowReadMoreButton] = useState(false);
  const [authorImage, setAuthorImage] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const refer = useRef(null);

  useEffect(() => {
    setShowReadMoreButton(
      refer.current.scrollHeight !== refer.current.clientHeight
    );
  }, []);

  useEffect(() => {
    const fetchAuthorImage = async () => {
      try {
        const storage = getStorage();
        const storageRef = ref(
          storage,
          `user_photos/${post.userID}/user-photo.jpg`
        );
        const downloadURL = await getDownloadURL(storageRef);
        console.log("Download URL:", downloadURL);
        setAuthorImage(downloadURL);
      } catch (error) {
        console.error(
          "Error fetching author's image from Firebase storage:",
          error
        );
        setAuthorImage(userPhoto);
      }
    };

    fetchAuthorImage();
  }, [post.userID]);

  const paragraphsStyles = {
    WebkitLineClamp: 3,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    display: "-webkit-box",
  };

  const handleDelete = async () => {
    try {
      if (post.userID === currentUserIDForDelete) {
        setIsDeleting(true);
        await deletePostFromFirestore(post.id);
        onDataUpdated();
        setDeleteModal(true);
      } else {
        console.log("You can only delete your own posts.");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <motion.div
      className={isDeleting ? "post-card deleting" : "post-card"}
      style={{ backgroundColor }}
      initial={{ opacity: 0,  x: index % 2 === 0 ? 50 : -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 0 }}
      whileHover={{ scale: 1.02 }}
    >
      <motion.div
        className={`post-user ${isDeleting ? "blur" : ""}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="post-user">
          <div className="post-content">
            <div className="post-author">
              <motion.img
                src={authorImage || userPhoto}
                alt="User"
                className="user-photo"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
              />
              <div>
                {" "}
                <strong>{post.username}</strong>
                <span>
                  <div className="post-date">
                    <small>Date:{date}</small>
                  </div>
                </span>
              </div>
            </div>
            <p style={isOpen ? null : paragraphsStyles} ref={refer}>
              {post.content}
            </p>
          </div>
          {showReadMoreButton && (
            <motion.button
              className="read-more-button"
              onClick={() => setIsOpen(!isOpen)}
              whileHover={{ scale: 1.1 }}
            >
              {isOpen ? "read less..." : "read more..."}
            </motion.button>
          )}
          <div className="delete-button">
            {post.userID === currentUserIDForDelete && (
              <motion.button
                onClick={handleDelete}
                disabled={isDeleting}
                whileHover={{ scale: 1.1 }}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>
      {isDeleting && (
        <div className="delete-animation-container">
          <DeleteAnimation />
        </div>
      )}
    </motion.div>
  );
};

export default PostCard;

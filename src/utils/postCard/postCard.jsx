import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  deletePostFromFirestore,
  getUserNameById,
} from "../../services/postServices";
import "./postCard.css";
import userPhoto from "../../images/userMale.png";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { DeleteAnimation } from "../successAnim";
import { Trash2 } from "react-feather";
import { useSelector } from "react-redux";
import LikeButton from "../likeAndComment/likeButton";
import CommentSection from "../likeAndComment/commentSection";

const getRandomColor = (str) => {
  const hash = str.split("").reduce((acc, char) => char.charCodeAt(0) + acc, 1);
  const hue = (hash % 60) + 210;
  const color = `hsl(${hue}, 50%, 50% , 0.8)`;

  return color;
};

const PostCard = ({
  post,
  onDataUpdated,
  currentUserIDForDelete,
  date,
  index,
  onLike,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const backgroundColor = getRandomColor(post.userID);
  const [isOpen, setIsOpen] = useState(false);
  const [showReadMoreButton, setShowReadMoreButton] = useState(false);
  const [authorImage, setAuthorImage] = useState(null);
  const refer = useRef(null);
  const [likedByNames, setLikedByNames] = useState([]);
  const { name } = useSelector((state) => state.user);
  const [fetchLikes, setFetchLikes] = useState(false);
  const [postIMG, setPostIMG] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleLike = () => {
    onLike();
    onDataUpdated();
    setFetchLikes((prevFetchLikes) => !prevFetchLikes);
  };

  useEffect(() => {
    const fetchLikedByNames = async () => {
      const names = [];

      if (Array.isArray(post.likedBy)) {
        for (const userId of post.likedBy) {
          const userData = await getUserNameById(userId);
          if (userData) {
            names.push(userData);
          }
        }
        setLikedByNames(names);
      }
    };

    fetchLikedByNames();
  }, [fetchLikes, post.likedBy]);

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
        setAuthorImage(downloadURL);
      } catch (error) {
        setAuthorImage(userPhoto);
      }
    };

    fetchAuthorImage();
  }, [post.userID]);

  useEffect(() => {
    const fetchPostImage = async () => {
      try {
        if (post.imageUrl) {
          const downloadURL = post.imageUrl;
          setPostIMG(downloadURL);
          console.log(downloadURL);
        }
      } catch (error) {
        console.error("Error fetching post image:", error);
      }
    };

    fetchPostImage();
  }, [post.imageUrl]);

  const paragraphsStyles = {
    WebkitLineClamp: 3,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    display: "-webkit-box",
  };

  const smooth = {
    transition: "height 0.3s ease-in-out",
  };
  const handleDelete = async () => {
    try {
      if (post.userID === currentUserIDForDelete) {
        setIsDeleting(true);
        await deletePostFromFirestore(post.id);
        onDataUpdated();
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
      initial={{ opacity: 0, x: index % 2 === 0 ? 100 : -100 }}
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
            <p
              style={isOpen ? null : paragraphsStyles}
              ref={refer}
              className="post-paragraph"
            >
              {post.content}
              <div>
                <img src={postIMG} alt="" />
              </div>
            </p>
          </div>
          <div className="like-section">
            <div
              className="like-button-container"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <LikeButton
                likedByNames={likedByNames}
                name={name}
                post={post}
                handleLike={handleLike}
                isDeleting={isDeleting}
              />
              {showTooltip && (
                <div className="tooltip">
                  {likedByNames.length > 0 ? (
                    <p>{likedByNames.join(",")}</p>
                  ) : (
                    <p>"No likes yet"</p>
                  )}
                </div>
              )}
            </div>
            <CommentSection post={post} onDataUpdated={onDataUpdated} />
          </div>
          {showReadMoreButton && (
            <motion.button
              className="read-more-button bn5"
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
                {isDeleting ? "Deleting..." : <Trash2 />}{" "}
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

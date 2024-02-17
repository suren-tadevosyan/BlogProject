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
import CommentSection, { CommentList } from "../likeAndComment/commentSection";
import { useNavigate } from "react-router-dom";

const getRandomColor = (str) => {
  const hash = str.split("").reduce((acc, char) => char.charCodeAt(0) + acc, 1);
  const hue = (hash % 60) + 210;
  const color = `hsl(${hue}, 50%, 50% , 0.97)`;

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
  const [showComments, setShowComments] = useState(false);
  const [showAsk, setShowAsk] = useState(false);
  const navigate = useNavigate();

  const handleConfirmation = (confirmed) => {
    if (confirmed) {
      setShowAsk(false);
      handleDelete();
    } else {
      setShowAsk(false);
    }
  };

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  const handleNavigate = () => {
    if (post.userID) {
      navigate(`/selectedPosts/${post.userID}`);
    } else {
      console.error("post.userID is not available yet.");
    }
  };
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
        className={`post-user ${isDeleting || showAsk ? "blur" : ""}`}
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
                onClick={handleNavigate}
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
            <div
              className="post-paragraph"
              style={isOpen ? null : paragraphsStyles}
              ref={refer}
            >
              {post.content}
            </div>
            {postIMG && (
              <div className="imgDiv">
                <img src={postIMG} alt="" />
              </div>
            )}
          </div>
          <div className="like-section-all">
            <div className="like-section">
              {" "}
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
              <CommentSection post={post} toggleComments={toggleComments} />
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
          </div>

          <div className="delete-button">
            {post.userID === currentUserIDForDelete && (
              <motion.button
                // onClick={handleDelete}
                onClick={() => setShowAsk(true)}
                disabled={isDeleting}
                whileHover={{ scale: 1.1 }}
              >
                {isDeleting ? "Deleting..." : <Trash2 />}{" "}
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>
      {showComments && (
        <div
          className={`post-user ${
            isDeleting || showAsk ? "blur" : ".comment-section"
          }`}
        >
          <CommentList post={post} toggleComments={toggleComments} />
        </div>
      )}
      {showAsk && (
        <div className="delete-animation-container">
          <div className="question"> 
            <p>Are you sure you want to delete this post ?</p>
            <div>
              <button onClick={() => handleConfirmation(true)}>Yes</button>
              <button onClick={() => handleConfirmation(false)}>No</button>
            </div>
          </div>
        </div>
      )}

      {isDeleting && (
        <div className="delete-animation-container">
          <DeleteAnimation />
        </div>
      )}
    </motion.div>
  );
};

export default PostCard;

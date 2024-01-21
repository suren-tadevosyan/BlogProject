import React, { useEffect, useRef, useState } from "react";
import { deletePostFromFirestore } from "../services/postServices";
import userPhoto from "../images/lamp.jpg";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

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
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const backgroundColor = getRandomColor(post.userID);
  const [isOpen, setIsOpen] = useState(false);
  const [showReadMoreButton, setShowReadMoreButton] = useState(false);
  const [authorImage, setAuthorImage] = useState(null);
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
      } else {
        console.log("You can only delete your own posts.");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <div
      className={isDeleting ? "post-card deleting" : "post-card"}
      style={{ backgroundColor }}
    >
      <div className="post-user">
        <div className="post-content">
          <div className="post-author">
            <img
              src={authorImage || userPhoto}
              alt="User"
              className="user-photo"
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
          <button
            className="read-more-button"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? "read less..." : "read more..."}
          </button>
        )}
        <div className="delete-button">
          {post.userID === currentUserIDForDelete && (
            <button onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostCard;

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as farHeart } from "@fortawesome/free-regular-svg-icons";

const LikeButton = ({ likedByNames, name, post, handleLike, isDeleting }) => (
  <button
    className={likedByNames.includes(name) ? "liked likeBtn" : "likeBtn"}
    disabled={isDeleting}
  >
    <FontAwesomeIcon
      className="icon"
      onClick={handleLike}
      icon={likedByNames.includes(name) ? faHeart : farHeart}
    />{" "}
    Like ({post.likes})
  </button>
);

export default LikeButton;

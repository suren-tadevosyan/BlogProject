import "./selectedUserPosts.css";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PostList from "../postList";
import VideoPlayer from "../../utils/videoPlayer";
import IMG from "../../images/welcomeAni.webm";
import { useSelector } from "react-redux";

const SelectedPosts = () => {
  const [isDataUpdated, setIsDataUpdated] = useState(false);
  const { id } = useSelector((state) => state.user);
  const [name, setName] = useState("");
  const [count, setCount] = useState(null);
  const { selectId } = useParams();

  return (
    <div className="posts-div">
      <VideoPlayer videoSource={IMG} />
      <h1>
        {name} has {count} posts{" "}
      </h1>
  
        <PostList
          likeID={id}
          currentUserID={selectId}
          isDataUpdated={isDataUpdated}
          setCount={setCount}
          setName={setName}
        />

    </div>
  );
};

export default SelectedPosts;

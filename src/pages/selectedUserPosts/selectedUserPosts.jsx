import "./selectedUserPosts.css";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import PostList from "../postList";

import { useSelector } from "react-redux";
import StarsCanvas from "../../utils/starCanvas/starCanvas.tsx";

const SelectedPosts = () => {
  const { id } = useSelector((state) => state.user);
  const [name, setName] = useState("");
  const [count, setCount] = useState(null);
  const { selectId } = useParams();

  return (
    <div className="selected-posts-div">
      <div className="starAnim">
        <StarsCanvas />
      </div>
      <h1>
        {name} has {count} posts{" "}
      </h1>

      <PostList
        likeID={id}
        currentUserID={selectId}
        setCount={setCount}
        setName={setName}
      />
    </div>
  );
};

export default SelectedPosts;

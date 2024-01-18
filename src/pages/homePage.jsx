import React from "react";
import userPhoto from "../images/lamp.jpg"; 
import { Link } from "react-router-dom"; 
import "../style/homePage.css";
import { useSelector } from "react-redux";

const HomePage = () => {
  const { name } = useSelector((state) => state.user);
  const { mode } = useSelector((state) => state.theme);

  return (
    <div className={`${mode === "dark" ? "home-page dark" : "home-page"} `}>
      <div className="user-profile">
        <img src={userPhoto} alt="User" className="user-photo" />
        <h1>{name}</h1>
      </div>

      <div className="navigation-buttons">
        <Link to="/myposts">
          <button className="button">My Posts</button>
        </Link>
        <Link to="/post">
          <button className="button">Add post</button>
        </Link>
        <Link to="/blog">
          <button className="button">Blogs</button>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;

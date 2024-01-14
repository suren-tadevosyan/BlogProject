import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { loginUser, removeUser } from "../redux/slices/auth";
import "../style/header.css";
import { toggleTheme } from "../redux/slices/theme";

const Header = ({}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { name, isLoggedIn } = useSelector((state) => state.user);
  const [showModal, setShowModal] = useState(false);
  const [typedText, setTypedText] = useState("");
  const {mode} = useSelector((state) => state.theme)

  useEffect(() => {
    if (isLoggedIn) {
      // Check if the modal has been shown before
      const hasModalBeenShown = localStorage.getItem("hasModalBeenShown");

      if (!hasModalBeenShown) {
        setShowModal(true);

        localStorage.setItem("hasModalBeenShown", "true");

        const welcomeMessage = `elcome to the website,  ${name}!!`;
        let index = 0;

        const typingInterval = setInterval(() => {
          if (index < welcomeMessage.length -1 ) {
            setTypedText((prevText) => prevText + welcomeMessage[index-1]);
            index++;
          } else {
            clearInterval(typingInterval);

            // Hide the modal after 2 seconds
            setTimeout(() => {
              setShowModal(false);
            }, 2500);
          }
        }, 150); // Adjust the interval speed as needed
      }
    }
  }, [isLoggedIn, name]);

  function onLogout() {
    dispatch(removeUser());
    localStorage.removeItem("userId");
    localStorage.removeItem("hasModalBeenShown");

    dispatch(loginUser(null));
    navigate("/login");
  }

  return (
    <header className={mode === "dark" ? "dark mode" : "mode"}>
      <div>
        <h2>Hello, {name}!</h2>
      </div>
      <div className="logo">
        <Link to="/">Your Blog</Link>
      </div>
      <div className="theme-toggle-button" onClick={() => dispatch(toggleTheme())}>
        {mode === "light" ? "Dark Mode" : "Light Mode"}
      </div>
      <nav>
        <ul>
          <li>
            <Link to="/home">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/contact">Contact</Link>
          </li>
        </ul>
      </nav>
      <div className="logout-button" onClick={onLogout}>
        Logout
      </div>
      {showModal && (
        <div className="modal-container">
          <div className="modal">
            <p>W{typedText}</p>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

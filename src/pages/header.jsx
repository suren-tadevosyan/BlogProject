import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { loginUser, removeUser } from "../redux/slices/auth";
import "../style/header.css";
import { toggleTheme } from "../redux/slices/theme";
import { MdWbSunny, MdBrightness2, MdExitToApp } from "react-icons/md";
import Welcome from "../utils/welcome";

const Header = ({}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { name, isLoggedIn } = useSelector((state) => state.user);
  const [showModal, setShowModal] = useState(false);
  const [typedText, setTypedText] = useState("");
  const { mode } = useSelector((state) => state.theme);
  const [scrolling, setScrolling] = useState(false);

  function getRandomColor() {
    // Generate random values for red, green, and blue channels
    const red = Math.floor(Math.random() * 256);
    const green = Math.floor(Math.random() * 256);
    const blue = Math.floor(Math.random() * 256);

    // Combine the values to create a CSS color string
    const color = `rgb(${red}, ${green}, ${blue})`;

    return color;
  }

  // Example usage:

  useEffect(() => {
    const handleScroll = () => {
      setScrolling(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      const hasModalBeenShown = localStorage.getItem("hasModalBeenShown");

      if (!hasModalBeenShown) {
        setShowModal(true);

        localStorage.setItem("hasModalBeenShown", "true");

        setTimeout(() => {
          setShowModal(false);
        }, 5000);
      }
    }
  }, [isLoggedIn, name]);

  const supportedLanguages = [
    "english",
    "spanish",
    "russian",
    "armenian",
    "french",
    "german",
    "italian",
    "chinese",
    "japanese",
    "korean",
  ];

  const modalComponents = supportedLanguages.map((lang, index) => {
    const randomColor = getRandomColor();
    return (
      <div key={index} className={`modal-item`} style={{ color: randomColor }}>
        <Welcome name={name} language={lang} />
      </div>
    );
  });

  function onLogout() {
    dispatch(removeUser());
    localStorage.removeItem("userId");
    localStorage.removeItem("hasModalBeenShown");

    dispatch(loginUser(null));
    navigate("/login");
  }

  return (
    <>
      <header className={`${mode === "dark" ? "dark mode" : "mode"} `}>
        <div onClick={() => navigate("/home")} className="user-name">
          <h2>Hello, {name}!</h2>
        </div>

        <div
          className="theme-toggle-button"
          onClick={() => dispatch(toggleTheme())}
        >
          {" "}
          {mode === "light" ? (
            <MdBrightness2 size={24} />
          ) : (
            <MdWbSunny size={24} />
          )}
        </div>
        <nav>
          <ul>
            <li>
              <Link to="/post">Post</Link>
            </li>
            <li>
              <Link to="/blog">Blog</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
          </ul>
        </nav>
        <div className="logout-button" onClick={onLogout}>
          Logout
          <MdExitToApp size={24} />
        </div>
      </header>
      {showModal && <div className="modal-container">{modalComponents}</div>}
    </>
  );
};

export default Header;

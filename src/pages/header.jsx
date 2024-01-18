import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { loginUser, removeUser } from "../redux/slices/auth";
import "../style/header.css";
import { toggleTheme } from "../redux/slices/theme";
import { MdWbSunny, MdBrightness2, MdExitToApp } from "react-icons/md";

const Header = ({}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { name, isLoggedIn } = useSelector((state) => state.user);
  const [showModal, setShowModal] = useState(false);
  const [typedText, setTypedText] = useState("");
  const { mode } = useSelector((state) => state.theme);
  const [scrolling, setScrolling] = useState(false);

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

        const welcomeMessage = `elcome to the website,  ${name}!!`;
        let index = 0;

        const typingInterval = setInterval(() => {
          if (index < welcomeMessage.length - 1) {
            setTypedText((prevText) => prevText + welcomeMessage[index - 1]);
            index++;
          } else {
            clearInterval(typingInterval);
            setTimeout(() => {
              setShowModal(false);
            }, 2500);
          }
        }, 150);
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

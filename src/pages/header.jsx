import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { loginUser, removeUser } from "../redux/slices/auth";

const Header = ({}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { name, email } = useSelector((state) => state.user);

  function onLogout() {
    dispatch(removeUser());
    localStorage.removeItem("userId");
    dispatch(loginUser(null));
    navigate("/login");
  }
  console.log(name);
  console.log(email);

  return (
    <header>
      <div>
        <h2>Hello, {name}!</h2>
      </div>
      <div className="logo">
        <Link to="/">Your Blog</Link>
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
    </header>
  );
};

export default Header;

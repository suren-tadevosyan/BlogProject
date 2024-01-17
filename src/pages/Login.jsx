import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser, setUser } from "../redux/slices/auth";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import "../style/login.css";
import Form from "../utils/form";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "email") {
      setEmail(e.target.value);
    }

    if (name === "password") {
      setPass(e.target.value);
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    const auth = getAuth();

    signInWithEmailAndPassword(auth, email, pass)
      .then(({ user }) => {
       
        dispatch(
          setUser({
            email: user.email,
            id: user.uid,
            token: user.accesToken,
            name: user.displayName,
          })
        );
        setError(null); 
        window.localStorage.setItem("userId", 1);
        dispatch(loginUser({ username: "username", password: "password" }));
        navigate("/summary");
      })
      .catch((error) => {
        console.error(
          "Firebase authentication error:",
          error.code,
          error.message
        );
        setError("Invalid email or password. Please try again.");
      });
  };

  const registerPage = () => {
    navigate("/registration");
  };
  return (
    <div className="login-container">
      <h2>Login</h2>
      <form className="login-form" action="#" onSubmit={submitHandler}>
      <Form
          label="Email"
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={handleChange}
          required
        />
        <Form
          label="Password"
          type="password"
          id="password"
          name="password"
          value={pass}
          onChange={handleChange}
          required
        />


        {error && <p className="error-message">{error}</p>}
        <div className="form-group">
          <input type="submit" value="Login" />
        </div>
        <div className="form-group">
          <input type="button" value="Register" onClick={registerPage} />
        </div>
      </form>
    </div>
  );
};

export default Login;

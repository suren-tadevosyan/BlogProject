import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, setUser } from "../redux/slices/auth";
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import userMale from "../images/userMale.png";
import "../style/login.css";
import Form from "../utils/form";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import googleImage from "../images/google.png";
import {
  addNewUserToFirestore,
  signOutAndUpdateStatus,
} from "../services/userServices";
import StarsCanvas from "../utils/starCanvas/starCanvas.tsx";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState(null);
  const [attempts, setAttempts] = useState(1);
  const { name } = useSelector((state) => state.user);
  const [showZoomInEffect, setShowZoomInEffect] = useState(false);

  const handleChange = (e) => {
    const { name } = e.target;

    if (name === "email") {
      setEmail(e.target.value);
    }

    if (name === "password") {
      setPass(e.target.value);
    }
  };

  const handleGoogleSignIn = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    try {
      signInWithPopup(auth, provider)
        .then(async ({ user }) => {
          setShowZoomInEffect(true);
          const userData = {
            name: user.displayName,
            email: user.email,
            googleId: user.uid,
          };

          addNewUserToFirestore(userData, dispatch, true, true, true);

          await signOutAndUpdateStatus(user.uid, true);

          const storage = getStorage();
          const storageRef = ref(
            storage,
            `user_photos/${user.uid}/user-photo.jpg`
          );

          getDownloadURL(storageRef)
            .then((downloadURL) => {
              const photo = downloadURL || userMale;
              console.log(downloadURL);

              dispatch(
                setUser({
                  email: user.email,
                  id: user.uid,
                  token: user.accessToken,
                  name: user.displayName,
                  photo: photo,
                })
              );

              setError(null);
              window.localStorage.setItem("userId", 1);
              dispatch(
                loginUser({ username: "username", password: "password" })
              );
            })
            .catch((error) => {
              if (error.code === "storage/object-not-found") {
                const photo = userMale;
                dispatch(
                  setUser({
                    email: user.email,
                    id: user.uid,
                    token: user.accessToken,
                    name: user.displayName,
                    photo: photo,
                  })
                );
                setError(null);
                window.localStorage.setItem("userId", 1);
                dispatch(
                  loginUser({ username: "username", password: "password" })
                );
              } else {
                console.error(
                  "Error fetching user's photo from Firebase storage:",
                  error
                );
              }
            });
        })
        .catch((error) => {
          console.error("Google Sign-In error:", error);
        });
    } catch (error) {
      console.error("Google Sign-In error:", error);
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    const auth = getAuth();

    signInWithEmailAndPassword(auth, email, pass)
      .then(async ({ user }) => {
        setShowZoomInEffect(true);
        await signOutAndUpdateStatus(user.uid, true);
        const storage = getStorage();
        const storageRef = ref(
          storage,
          `user_photos/${user.uid}/user-photo.jpg`
        );

        getDownloadURL(storageRef)
          .then((downloadURL) => {
            const photo = downloadURL || userMale;
            console.log(downloadURL);
            dispatch(
              setUser({
                email: user.email,
                id: user.uid,
                token: user.accessToken,
                name: user.displayName,
                photo: photo,
              })
            );
            setError(null);
            window.localStorage.setItem("userId", 1);
            dispatch(loginUser({ username: "username", password: "password" }));
          })
          .catch((error) => {
            if (error.code === "storage/object-not-found") {
              const photo = userMale;
              dispatch(
                setUser({
                  email: user.email,
                  id: user.uid,
                  token: user.accessToken,
                  name: user.displayName,
                  photo: photo,
                })
              );
              setError(null);
              window.localStorage.setItem("userId", 1);
              dispatch(
                loginUser({ username: "username", password: "password" })
              );
            } else {
              console.error(
                "Error fetching user's photo from Firebase storage:",
                error
              );
            }
          });
      })
      .catch((error) => {
        console.error(
          "Firebase authentication error:",
          error.code,
          error.message
        );
        setAttempts(attempts + 1);
        setError(
          <div>
            Invalid password for user {name}. Please try again.
            <br />
            Wrong attempts {attempts}
          </div>
        );
      });
  };

  const registerPage = () => {
    navigate("/registration");
  };
  return (
    <div className="login-register">
      <StarsCanvas showZoomInEffect={showZoomInEffect} />

      <div
        className={
          showZoomInEffect ? "login-container submitted" : "login-container"
        }
      >
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
          <div className="form-group googleLogin">
            <input type="submit" value="Login" />
            <button onClick={handleGoogleSignIn}>
              <img src={googleImage} alt="Google" />
            </button>
          </div>
          <div className="form-group">
            <input type="button" value="Register" onClick={registerPage} />
          </div>
          <div className="form-group"></div>
        </form>
      </div>
    </div>
  );
};

export default Login;

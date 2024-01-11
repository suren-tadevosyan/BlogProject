import { useDispatch, useSelector } from "react-redux";
import { loginUser, setUser } from "../redux/slices/auth";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { setPassword, validatePassword } from "../redux/slices/password";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    password: {
      password,
      isUppercasePresent,
      isLowercasePresent,
      isNumberPresent,
      isSpecialCharPresent,
    },
  } = useSelector((state) => state);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [passwordMatch, setPasswordMatch] = useState(true);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [name, setName] = useState("");

  const handleFocus = () => {
    setIsPasswordFocused(true);
  };

  const handleBlur = (e) => {
    setIsPasswordFocused(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === "email") {
      setEmail(e.target.value);
      console.log(email);
    }

    if (name === "name") {
      setName(e.target.value);
    }

    if (name === "password") {
      const strength = calculatePasswordStrength(value);
      setPasswordStrength(strength);
      setPass(e.target.value);
    }
    if (name === "confirmPassword" || name === "password") {
      setPasswordMatch(
        value ===
          (name === "confirmPassword"
            ? formData.password
            : formData.confirmPassword)
      );
    }

    dispatch(setPassword(e.target.value));
    dispatch(validatePassword());
  };

  const calculatePasswordStrength = (password) => {
    const length = password.length;
    if (length < 6) {
      return 0;
    } else if (length < 10) {
      return 1;
    } else {
      return 2;
    }
  };
  const getStrengthText = (strength) => {
    switch (strength) {
      case 0:
        return "Weak";
      case 1:
        return "Medium";
      case 2:
        return "Strong";
      default:
        return "";
    }
  };
  const getStrengthColor = (strength) => {
    const colors = ["red", "orange", "green"];
    return colors[strength];
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (
      passwordMatch &&
      isUppercasePresent &&
      isLowercasePresent &&
      isNumberPresent &&
      isSpecialCharPresent
    ) {
      const auth = getAuth();
      createUserWithEmailAndPassword(auth, email, password)
        .then(({ user }) => {
          updateProfile(user, { displayName: name })
            .then(() => {
              const { email, uid: id, accessToken: token } = user;
              dispatch(
                setUser({
                  email,
                  id,
                  token,
                  name,
                })
              );
            })
            .catch(console.error);
        })
        .catch(console.error);
      window.localStorage.setItem("userId", 1);
      dispatch(loginUser({ username: "username", password: "password" }));
      navigate("/summary");
    } else {
      console.log("edrer");
    }
  };

  return (
    <div className="login-container">
      <h2>Creating Account</h2>
      <form className="login-form" action="#" onSubmit={submitHandler}>
        <div className="form-group">
          <label htmlFor="email">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <div className="password-input-container">
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              required
            />

            {isPasswordFocused && (
              <div className="password-feedback-popup">
                <div className="password-strength-indicator">
                  <div
                    className="strength-bar"
                    style={{
                      width: `${(passwordStrength + 1) * 33.33}%`,
                      backgroundColor: getStrengthColor(passwordStrength),
                    }}
                  ></div>
                </div>
                <p className="password-feedback">
                  <span
                    style={{
                      fontWeight: "bold",
                      color: getStrengthColor(passwordStrength),
                    }}
                  >
                    Password Strength: {getStrengthText(passwordStrength)}
                  </span>
                  <br />
                  Password must contain at least 8 characters, including one
                  uppercase letter, one lowercase letter, one number, and one
                  special character.
                </p>

                <ul className="password-requirements">
                  <li>
                    <input
                      type="checkbox"
                      checked={isUppercasePresent}
                      readOnly
                    />
                    Contains at least one uppercase letter
                  </li>
                  <li>
                    <input
                      type="checkbox"
                      checked={isLowercasePresent}
                      readOnly
                    />
                    Contains at least one lowercase letter
                  </li>
                  <li>
                    <input type="checkbox" checked={isNumberPresent} readOnly />
                    Contains at least one number
                  </li>
                  <li>
                    <input
                      type="checkbox"
                      checked={isSpecialCharPresent}
                      readOnly
                    />
                    Contains at least one special character
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="password">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          {!passwordMatch && (
            <p style={{ color: "red", margin: "5px 0" }}>
              Passwords do not match
            </p>
          )}
        </div>
        <div className="form-group">
          <input type="submit" value="Register" />
        </div>
      </form>
    </div>
  );
};

export default Register;

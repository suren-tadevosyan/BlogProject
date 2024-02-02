import { useDispatch, useSelector } from "react-redux";
import { loginUser, setUser } from "../redux/slices/auth";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ErrorModal, ErrorMessage } from "../utils/errorModal";
import { setPassword, validatePassword } from "../redux/slices/password";
import PasswordStrengthIndicator from "../utils/passwordStrength";
import { calculatePasswordStrength } from "../utils/passwordUtils";
import Form from "../utils/form";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { addNewUserToFirestore } from "../services/userServices";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [passwordMatch, setPasswordMatch] = useState(true);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [name, setName] = useState("");

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

  const closeErrorModal = () => {
    setErrorModalVisible(false);
  };

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
      dispatch(setPassword(e.target.value));
      dispatch(validatePassword());
    }
    if (name === "confirmPassword" || name === "password") {
      setPasswordMatch(
        value ===
          (name === "confirmPassword"
            ? formData.password
            : formData.confirmPassword)
      );
    }
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
      addNewUserToFirestore(
        formData,
        dispatch,
        setErrorMessage,
        setErrorModalVisible,
        navigate
      );
    } else {
      console.log("edrer");
    }
  };

  const getBack = () => {
    navigate("/login");
  };

  return (
    <div className="login-register">
      <div className="login-container">
        <h2>Creating Account</h2>
        <form className="login-form" action="#" onSubmit={submitHandler}>
          <Form
            label="Name"
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <Form
            label="Email"
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <Form
            label="Password"
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
            <PasswordStrengthIndicator
              passwordStrength={passwordStrength}
              isUppercasePresent={isUppercasePresent}
              isLowercasePresent={isLowercasePresent}
              isNumberPresent={isNumberPresent}
              isSpecialCharPresent={isSpecialCharPresent}
              className={isPasswordFocused ? "visible" : ""}
            />
          )}

          <Form
            label="Confirm Password"
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          {!passwordMatch && <ErrorMessage message="Passwords do not match" />}
          <div className="form-group">
            <input type="submit" value="Register" />
          </div>
          <div className="form-group">
            <input type="button" value="Go back to Login" onClick={getBack} />
          </div>
        </form>
      </div>
      <div className={errorModalVisible ? "backdrop" : ""}>
        <ErrorModal
          message={errorMessage}
          onClose={closeErrorModal}
          visible={errorModalVisible}
        />
      </div>
    </div>
  );
};

export default Register;

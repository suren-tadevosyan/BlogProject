import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import firestore from "../fireStore";
import { loginUser, setUser } from "../redux/slices/auth";

const addNewUserToFirestore = async (
  formData,
  dispatch,
  setErrorMessage,
  setErrorModalVisible,
  navigate
) => {
  try {
    const auth = getAuth();

    const { user } = await createUserWithEmailAndPassword(
      auth,
      formData.email,
      formData.password
    );

    await updateProfile(user, { displayName: formData.name });

    const { email, uid: id, accessToken: token } = user;

    dispatch(
      setUser({
        email,
        id,
        token,
        name: formData.name,
      })
    );

    window.localStorage.setItem("userId", id);

    dispatch(loginUser({ username: "username", password: "password" }));

    const userRef = collection(firestore, "users");
    const userData = {
      email: email,
      name: formData.name,
      userId: id,
    };

    await addDoc(userRef, userData);

    console.log("User added to Firestore collection");
    navigate("/summary");
  } catch (error) {
    if (error.code === "auth/email-already-in-use") {
      const message = "User with this email already exists";
      setErrorMessage(message);
      setErrorModalVisible(true);
      console.log("User with this email already exists");
    } else {
      console.error("Error creating user:", error.message);
    }
  }
};

export { addNewUserToFirestore };

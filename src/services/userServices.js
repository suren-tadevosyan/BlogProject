import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,

} from "firebase/auth";
import {
  collection,
  addDoc,
  updateDoc,

  getDocs,
  query,
  where,
  
} from "firebase/firestore";
import firestore from "../fireStore";
import { loginUser, setUser } from "../redux/slices/auth";

const addNewUserToFirestore = async (
  formData,
  dispatch,
  setErrorMessage,
  setErrorModalVisible,

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
      isActive: true,
    };

    await addDoc(userRef, userData);

    console.log("User added to Firestore collection");
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
const getActiveUsers = async () => {
  const userRef = collection(firestore, "users");
  const activeUsersQuery = query(userRef, where("isActive", "==", true));

  const querySnapshot = await getDocs(activeUsersQuery);

  const activeUsers = [];
  querySnapshot.forEach((doc) => {
    activeUsers.push(doc.data());
  });

  return activeUsers;
};

const signOutAndUpdateStatus = async (userId, value) => {
  try {
    const userRef = collection(firestore, "users");
    const userQuery = query(userRef, where("userId", "==", userId));
    const userSnapshot = await getDocs(userQuery);

    if (userSnapshot.docs.length > 0) {
      const userDoc = userSnapshot.docs[0].ref;
      await updateDoc(userDoc, { isActive: value });
      console.log("User signed out and status updated");
    } else {
      console.error("User document not found for userId:", userId);
    }
  } catch (error) {
    console.error("Error updating user status:", error.message);
  }
};
export { addNewUserToFirestore, signOutAndUpdateStatus, getActiveUsers };

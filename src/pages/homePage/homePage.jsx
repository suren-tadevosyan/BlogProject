import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "./homePage.css";
import { useDispatch, useSelector } from "react-redux";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { updatePhoto } from "../../redux/slices/auth";
import userPhoto1 from "../../images/userMale.png";
import LoadingSpinner from "../../utils/loading";
import ActiveUsersList from "../../utils/activeUsersList";

const HomePage = () => {
  const dispatch = useDispatch();
  const { name, photo, id } = useSelector((state) => state.user);
  const { mode } = useSelector((state) => state.theme);
  const [userPhoto, setUserPhoto] = useState(
    photo.photo ? photo.photo : userPhoto1
  );
  const [isLoading, setIsLoading] = useState(true);

  const handleUpdatePhoto = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = async (e) => {
      const file = e.target.files[0];

      if (file) {
        try {
          const storage = getStorage();
          const storageRef = ref(storage, `user_photos/${id}/user-photo.jpg`);
          await uploadBytes(storageRef, file);

          const downloadURL = await getDownloadURL(storageRef);

          setUserPhoto(downloadURL);

          dispatch(updatePhoto(downloadURL));
        } catch (error) {
          console.error("Error updating photo in Firebase:", error.message);
        }
      }
    };

    input.click();
  };

  useEffect(() => {
    const fetchAuthorImage = async () => {
      try {
        const storage = getStorage();
        const storageRef = ref(storage, `user_photos/${id}/user-photo.jpg`);
        const downloadURL = await getDownloadURL(storageRef);
        console.log("Download URL:", downloadURL);
        setUserPhoto(downloadURL);
      } catch (error) {
        console.error(
          "Error fetching author's image from Firebase storage:",
          error
        );
        setUserPhoto(userPhoto);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAuthorImage();
  }, [userPhoto, id]);

  return (
    <motion.div
      className={`home-page ${mode === "dark" ? "dark" : ""}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="user-profile">
        <div className="user-photo-container">
          {isLoading ? (
            <div className="profile-photo">
              <LoadingSpinner className={"loader"} />
            </div>
          ) : (
            <img src={userPhoto} alt="User" className="profile-photo" />
          )}
          <button onClick={handleUpdatePhoto} className="updatePhoto">
            Update Photo
          </button>
        </div>
        <h1>{name}</h1>
      </div>

      <motion.div
        className="navigation-buttons"
        initial={{ x: "100vw" }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 120 }}
      >
        <Link to="/myposts">
          <button className="button">My Posts</button>
        </Link>
        <Link to="/post">
          <button className="button">Add post</button>
        </Link>
        <Link to="/blog">
          <button className="button">Blogs</button>
        </Link>
      </motion.div>

      <div>
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="online-users"
        >
          <h2>Online Users</h2>
          <ActiveUsersList />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default HomePage;

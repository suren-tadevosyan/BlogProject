import React from "react";
import { Link } from "react-router-dom";
import "../style/homePage.css";
import { useDispatch, useSelector } from "react-redux";
import { getAuth, updateProfile } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { updatePhoto } from "../redux/slices/auth";
import userPhoto from "../images/userMale.png"

const HomePage = () => {
  const dispatch = useDispatch();
  const { name, photo, id } = useSelector((state) => state.user);
  const { mode } = useSelector((state) => state.theme);


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

          // Dispatch the action to update the photo in the Redux store
          dispatch(updatePhoto(downloadURL));
        } catch (error) {
          console.error("Error updating photo in Firebase:", error.message);
          // Handle storage update error
        }
      }
    };

    input.click();
  };

  return (
    <div className={`${mode === "dark" ? "home-page dark" : "home-page"} `}>
      <div className="user-profile">
        <img src={photo ? photo.photo : userPhoto}  alt="User" className="user-photo" />
        <h1>{name}</h1>
        <button onClick={handleUpdatePhoto}>Update Photo</button>
      </div>

      <div className="navigation-buttons">
        <Link to="/myposts">
          <button className="button">My Posts</button>
        </Link>
        <Link to="/post">
          <button className="button">Add post</button>
        </Link>
        <Link to="/blog">
          <button className="button">Blogs</button>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;

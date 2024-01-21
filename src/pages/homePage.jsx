import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../style/homePage.css";
import { useDispatch, useSelector } from "react-redux";
import { getAuth, updateProfile } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { updatePhoto } from "../redux/slices/auth";
import userPhoto1 from "../images/userMale.png"
import LoadingSpinner from "../utils/loading";

const HomePage = () => {
  const dispatch = useDispatch();
  const { name, photo, id } = useSelector((state) => state.user);
  const { mode } = useSelector((state) => state.theme);
  const [userPhoto,setUserPhoto] = useState(photo.photo ? photo.photo : userPhoto1)
  const [isloading,setIsloading] = useState(true)
  
  
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
          
          
          setUserPhoto(downloadURL)
          
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
        const storageRef = ref(
          storage,
          `user_photos/${id}/user-photo.jpg`
        );
        const downloadURL = await getDownloadURL(storageRef);
        console.log("Download URL:", downloadURL);
        setUserPhoto(downloadURL);
      } catch (error) {
        console.error(
          "Error fetching author's image from Firebase storage:",
          error
        );
        setUserPhoto(userPhoto);
      } finally{
        setIsloading(false)
      }
    };

    fetchAuthorImage();
  }, [userPhoto]);






  
  return (
    <div className={`${mode === "dark" ? "home-page dark" : "home-page"} `}>
      <div className="user-profile">
      {isloading ? (
          // Render a loader while the photo is being fetched
          <div className="loader"><LoadingSpinner/></div>
        ) : (
          // Render the user photo when it is available
          <img src={userPhoto} alt="User" className="profile-photo" />
        )}
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

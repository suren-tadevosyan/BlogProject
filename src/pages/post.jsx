// Post.js
// import React from "react";
// import firestore from "../fireStore"; // Import the Firestore setup
// import { collection, addDoc } from "firebase/firestore";

// const Post = () => {
//   const addDataToCollection = async (data) => {
//     try {
//       const docRef = await addDoc(collection(firestore, "posts"), data);
//       console.log("Document written with ID: ", docRef.id);
//     } catch (error) {
//       console.error("Error adding data to Firestore:", error);
//     }
//   };

//   const dataToAdd = {
//     field1: "value1",
//     field2: "value2",
//     // ... other fields
//   };

//   addDataToCollection(dataToAdd);

//   return <div>Posts</div>;
// };

// export default Post;

// components/UserPosts.js
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserPosts } from "../redux/actions/postActions";
import { selectUserPosts } from "../redux/slices/postSlices";
import PostForm from "./postForm";

const Post = () => {
  const dispatch = useDispatch();
  const userPosts = useSelector(selectUserPosts);

  useEffect(() => {
    dispatch(getUserPosts());
  }, [dispatch]);
  

  return (
    <div>
      
      <PostForm />
      <ul>
        {/* {posts.map((post) => (
          <li key={post.id}>{post.content}</li>
        ))} */}
      </ul>
    </div>
  );
};

export default Post;

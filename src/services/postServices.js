// services/postService.js
import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { auth } from "../firebase"; // Assuming you have a separate file for your Firebase configuration
import firestore from "../fireStore";

export const addPostToFirestore = async (content) => {
  // Get the currently authenticated user
  const user = auth.currentUser;

  if (user) {
    // Add a new post to the Firestore collection
    const username = user.displayName;
    const postsCollection = collection(firestore, "posts");
    await addDoc(postsCollection, {
      content: content,
      timestamp: serverTimestamp(),
      userID: user.uid,
      username: username,
    });
  } else {
    // Handle case where user is not authenticated
  }
};

export const getUserPostsFromFirestore = async () => {
  const user = auth.currentUser;

  if (user) {
    // Query Firestore to get posts for the current user
    const postsCollection = collection(firestore, "posts");
    const querySnapshot = await getDocs(
      query(postsCollection, where("userID", "==", user.uid))
    );

    // Extract user-specific posts
    const userPosts = [];
    querySnapshot.forEach((doc) => {
      const post = doc.data();
      userPosts.push(post);
    });

    const allUserPosts = [];
    const allPostsQuerySnapshot = await getDocs(postsCollection);
    allPostsQuerySnapshot.forEach((doc) => {
      const post = { id: doc.id, ...doc.data() };
      allUserPosts.push(post);
    });
   

    return { userPosts, allUserPosts };
  } else {
    // Handle case where user is not authenticated
    return [];
  }
};

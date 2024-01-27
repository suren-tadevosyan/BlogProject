
import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
  serverTimestamp,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { auth } from "../firebase"; 
import firestore from "../fireStore";

const convertTimestampToDate = (timestamp) => {
  return timestamp ? timestamp.toDate() : null;
};
export const addPostToFirestore = async (content) => {

  const user = auth.currentUser;

  if (user) {
   
    const username = user.displayName;
    const postsCollection = collection(firestore, "posts");
    await addDoc(postsCollection, {
      content: content,
      timestamp: serverTimestamp(),
      userID: user.uid,
      username: username,
    });
  } else {
   
  }
};

export const getUserPostsFromFirestore = async () => {
  const user = auth.currentUser;

  if (user) {
    
    const postsCollection = collection(firestore, "posts");
    const querySnapshot = await getDocs(
      query(postsCollection, where("userID", "==", user.uid))
    );

    
    const userPosts = [];
    querySnapshot.forEach((doc) => {
      const post = doc.data();
      post.timestamp = convertTimestampToDate(post.timestamp);

      userPosts.push(post);
    });

    const allUserPosts = [];
    const allPostsQuerySnapshot = await getDocs(postsCollection);
    allPostsQuerySnapshot.forEach((doc) => {
      const post = { id: doc.id, ...doc.data() };
      post.timestamp = convertTimestampToDate(post.timestamp);

      allUserPosts.push(post);
    });

    return { userPosts, allUserPosts };
  } else {
   
    return [];
  }
};

export const deletePostFromFirestore = async (postId) => {
  try {
    const postRef = doc(collection(firestore, "posts"), postId);
    await deleteDoc(postRef);
    console.log("Post deleted successfully!");
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
};

export const deleteAllPostsForUser = async (userID) => {
  try {
    const postsRef = collection(firestore, "posts");
    const userPostsQuery = query(postsRef, where("userID", "==", userID));
    const userPostsSnapshot = await getDocs(userPostsQuery);

    // Iterate through user's posts and delete each post
    userPostsSnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });

    console.log("All posts deleted successfully!");
  } catch (error) {
    console.error("Error deleting all posts for user:", error);
    throw error;
  }
};
import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
  serverTimestamp,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
  getFirestore,
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
      likes: 0,
      likedBy: [],
      comments: [],
    });
  } else {
  }
};

export const likePostInFirestore = async (postId, userId) => {
  const postRef = doc(firestore, "posts", postId);

  try {
    // Get the current post data
    const postSnapshot = await getDoc(postRef);
    const postData = postSnapshot.data();

    console.log(postData.likedBy);
    console.log(userId);
    // Ensure postData is defined
    if (postData && userId) {
      // Ensure likedBy is initialized as an array

      // Update the document
      await updateDoc(postRef, {
        likes: (postData.likes || 0) + 1,
        likedBy: [...postData.likedBy, userId],
      });

      console.log("Post liked successfully!");
    } else {
      console.error("Invalid post data.");
    }
  } catch (error) {
    console.error("Error liking post:", error);
    throw error;
  }
};

const fetchUsernamesForLikedBy = async (likedByUserIds) => {
  const db = getFirestore();
  const likedByUsernamesData = [];

  for (const likedByUserID of likedByUserIds) {
    const userQuery = query(collection(db, "users"), where("userID", "==", likedByUserID));
    const userSnapshot = await getDocs(userQuery);

    if (userSnapshot.size > 0) {
      const userData = userSnapshot.docs[0].data();
      likedByUsernamesData.push(userData.username);
      
    }
  }

  return likedByUsernamesData;
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

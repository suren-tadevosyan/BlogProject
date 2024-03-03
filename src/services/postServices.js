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
  arrayUnion,
} from "firebase/firestore";
import { auth } from "../firebase";
import firestore from "../fireStore";

const convertTimestampToDate = (timestamp) => {
  return timestamp ? timestamp.toDate() : null;
};
export const addPostToFirestore = async (content, imageUrl) => {
  const user = auth.currentUser;

  if (user) {
    const username = user.displayName;
    const postsCollection = collection(firestore, "posts");

    const postData = {
      content: content,
      timestamp: serverTimestamp(),
      userID: user.uid,
      username: username,
      likes: 0,
      likedBy: [],
      comments: [],
    };

    if (imageUrl) {
      postData.imageUrl = imageUrl;
    }

    await addDoc(postsCollection, postData);
  } else {
  }
};

export const getUserNameById = async (userId) => {
  const firestore = getFirestore();
  try {
    const querySnapshot = await getDocs(
      collection(firestore, "users"),
      where("userId", "==", userId)
    );

    const userPosts = querySnapshot.docs.map((doc) => doc.data());

    if (!querySnapshot.empty) {
      const filteredPosts = userPosts.filter((elem) => elem.userId === userId);

      const username = filteredPosts[0].name || null;

      return username;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting user name from posts:", error);
    throw error;
  }
};

/////////LIKE POST//////////////////////////////////////////////////////////

export const likePostInFirestore = async (postId, userId) => {
  const postRef = doc(firestore, "posts", postId);

  try {
    const postSnapshot = await getDoc(postRef);
    const postData = postSnapshot.data();

    if (postData && userId) {
      if (postData.likedBy.includes(userId)) {
        await updateDoc(postRef, {
          likes: Math.max((postData.likes || 0) - 1, 0),
          likedBy: postData.likedBy.filter((id) => id !== userId),
        });

        // console.log("Post unliked successfully!");
      } else {
        await updateDoc(postRef, {
          likes: (postData.likes || 0) + 1,
          likedBy: [...postData.likedBy, userId],
        });

        // console.log("Post liked successfully!");
      }
    } else {
      console.error("Invalid post data.");
    }
  } catch (error) {
    console.error("Error liking or unliking post:", error);
    throw error;
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

/////////COMMENT POST//////////////////////////////////////////////////////////

export const addCommentToPost = async (postId, comment, commentAuthor) => {
  const postRef = doc(firestore, "posts", postId);
  await updateDoc(postRef, {
    comments: arrayUnion({
      id: new Date().getTime().toString(),
      text: comment,
      author: commentAuthor,
    }),
  });
};

export const getCommentsForPost = async (postId) => {
  const postRef = doc(firestore, "posts", postId);
  const postSnapshot = await getDoc(postRef);
  if (postSnapshot.exists()) {
    const postData = postSnapshot.data();
    return postData || [];
  }
  return [];
};

export const deleteCommentFromPost = async (postId, commentId) => {
  const postRef = doc(firestore, "posts", postId);
  const postSnapshot = await getDoc(postRef);

  if (postSnapshot.exists()) {
    const postData = postSnapshot.data();
    const updatedComments = postData.comments.filter(
      (comment) => comment.id !== commentId
    );

    await updateDoc(postRef, {
      comments: updatedComments,
    });
  }
};

/////////Delet POST//////////////////////////////////////////////////////////

export const deletePostFromFirestore = async (postId) => {
  try {
    const postRef = doc(collection(firestore, "posts"), postId);
    await deleteDoc(postRef);
    // console.log("Post deleted successfully!");
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

    userPostsSnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });

    // console.log("All posts deleted successfully!");
  } catch (error) {
    console.error("Error deleting all posts for user:", error);
    throw error;
  }
};

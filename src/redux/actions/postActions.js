import {
  addPostToFirestore,
  getUserPostsFromFirestore,
} from "../../services/postServices";
import {

  getUserPostsStart,
  getUserPostsSuccess,
  getUserPostsFailure,
} from "../slices/postSlices";

export const addPost = (content) => async (dispatch) => {
  await addPostToFirestore(content);
  dispatch(getUserPosts());
};

export const getUserPosts = () => async (dispatch) => {
  try {
    dispatch(getUserPostsStart());
    const { userPosts, allUserPosts } = await getUserPostsFromFirestore();
    const serializablePosts = allUserPosts.map(post => ({
      ...post,
      timestamp: post.timestamp.toISOString(), // Convert to string or use getTime() for number
    }));
    dispatch(getUserPostsSuccess(serializablePosts));

    // Dispatching allUserPosts to the state
  } catch (error) {
    dispatch(getUserPostsFailure(error.message));
  }
};

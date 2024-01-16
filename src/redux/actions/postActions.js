import {
  addPostToFirestore,
  getUserPostsFromFirestore,
} from "../../services/postServices";
import {
  setUserPosts,
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
    dispatch(getUserPostsSuccess(allUserPosts));
    // Dispatching allUserPosts to the state
  } catch (error) {}
};

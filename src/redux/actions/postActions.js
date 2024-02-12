import {
  addPostToFirestore,
  getUserPostsFromFirestore,
} from "../../services/postServices";
import {
  getUserPostsStart,
  getUserPostsSuccess,
  getUserPostsFailure,
} from "../slices/postSlices";

export const addPost = (content, imageUrl) => async (dispatch) => {
  await addPostToFirestore(content, imageUrl);
  dispatch(getUserPosts());
};

export const getUserPosts = () => async (dispatch) => {
  try {
    dispatch(getUserPostsStart());
    const { allUserPosts } = await getUserPostsFromFirestore();
    const serializablePosts = allUserPosts.map((post) => ({
      ...post,
      timestamp: post.timestamp.toISOString(),
    }));
    dispatch(getUserPostsSuccess(serializablePosts));
  } catch (error) {
    dispatch(getUserPostsFailure(error.message));
  }
};

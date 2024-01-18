
import { createSlice } from "@reduxjs/toolkit";

const postSlice = createSlice({
  name: "posts",
  initialState: {
    userPosts: [],
    loading: false,
    error: null,
 
  },
  reducers: {
    setUserPosts: (state, action) => {
      state.userPosts = action.payload;
    },
    getUserPostsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    getUserPostsSuccess: (state, action) => {
      state.loading = false;
      const serializedUserPosts = action.payload.map((post) => ({
        ...post,
        timestamp: post.timestamp.toISOString(),
      }));

      state.userPosts = serializedUserPosts;
    },
    getUserPostsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
 
  },
});

export const {
  setUserPosts,
  getUserPostsStart,
  getUserPostsSuccess,
  getUserPostsFailure,
} = postSlice.actions;
export const selectUserPosts = (state) => state.posts.userPosts;
export default postSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userPosts: [],
  loading: false,
  error: null,
  postCounts: {
    today: 0,
    thisWeek: 0,
    total: 0,
  },
};

const postSlice = createSlice({
  name: "posts",
  initialState,
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
        timestamp:
          post.timestamp instanceof Date
            ? post.timestamp.toISOString()
            : post.timestamp,
      }));

      state.userPosts = serializedUserPosts;
      localStorage.setItem("userPosts", JSON.stringify(serializedUserPosts));
    },
    getUserPostsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    setPostCounts(state, action) {
      state.postCounts = action.payload;
    },

  },
});

export const {
  setUserPosts,
  getUserPostsStart,
  getUserPostsSuccess,
  getUserPostsFailure,
  setPostCounts,

} = postSlice.actions;
export const selectUserPosts = (state) => state.posts.userPosts;
export default postSlice.reducer;

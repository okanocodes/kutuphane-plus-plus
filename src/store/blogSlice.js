import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API_BASE_URL } from "../utils/api";

const BASE_URL = API_BASE_URL;

export const fetchBlogs = createAsyncThunk(
  "blogs/fetchBlogs",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/blogs`);
      if (!res.ok) throw new Error("Blog yazıları yüklenemedi.");
      return await res.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const fetchBlogById = createAsyncThunk(
  "blogs/fetchBlogById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/blogs/${id}`);
      if (!res.ok) throw new Error("Blog detayı yüklenemedi.");
      return await res.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const initialState = {
  blogs: [],
  selectedBlog: null,
  status: "idle",
  error: null,
};

const blogSlice = createSlice({
  name: "blogs",
  initialState,
  reducers: {
    clearSelectedBlog: (state) => {
      state.selectedBlog = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogs.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.blogs = action.payload;
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchBlogById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchBlogById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selectedBlog = action.payload;
      })
      .addCase(fetchBlogById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearSelectedBlog } = blogSlice.actions;
export default blogSlice.reducer;

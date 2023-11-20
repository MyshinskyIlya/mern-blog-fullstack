import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../API/axios.js";

export const fetchPosts = createAsyncThunk("/posts/fetchPosts", async () => {
    const { data } = await axios.get("/posts");
    return data;
});

export const fetchTags = createAsyncThunk("/posts/fetchTags", async () => {
    const { data } = await axios.get("/tags");
    return data;
});

export const fetchRemovePost = createAsyncThunk(
    "/posts/fetchRemovePost",
    async (id) => {
        await axios.delete(`/posts/${id}`);
    }
);

const initialState = {
    posts: {
        items: [],
        status: "loading",
    },
    tags: {
        items: [],
        status: "loading",
    },
};

const postsSlice = createSlice({
    name: "posts",
    initialState,
    reducers: {},
    extraReducers: {
        [fetchPosts.pending]: (state, action) => {
            state.posts.status = "loading";
        },
        [fetchPosts.fulfilled]: (state, action) => {
            state.posts.items = action.payload;
            state.posts.status = "success";
        },
        [fetchPosts.rejected]: (state) => {
            state.posts.items = [];
            state.posts.status = "error";
        },
        [fetchTags.pending]: (state, action) => {
            state.tags.status = "loading";
        },
        [fetchTags.fulfilled]: (state, action) => {
            state.tags.items = action.payload;
            state.tags.status = "success";
        },
        [fetchTags.rejected]: (state) => {
            state.tags.items = [];
            state.tags.status = "error";
        },

        // Удаление статьи
        [fetchRemovePost.pending]: (state, action) => {
            state.posts.items = state.posts.items.filter(
                (item) => item._id !== action.meta.arg
            );
            state.tags.status = "loading";
        },
    },
});

export const { SetPostsArray } = postsSlice.actions;

export const postsReducer = postsSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";
import { fetchAllProjects } from "./projectAPI";

const projectSlice = createSlice({
  name: "projects",
  initialState: {
    allProjects: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProjects.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllProjects.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.allProjects = action.payload;
      })
      .addCase(fetchAllProjects.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default projectSlice.reducer;

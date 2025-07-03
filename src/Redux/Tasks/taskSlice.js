import { createSlice } from "@reduxjs/toolkit";
import { fetchAllTasks } from "./taskAPI";
const tasksSlice = createSlice({
  name: "tasks",
  initialState: {
    allTasks: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllTasks.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllTasks.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.allTasks = action.payload;
      })
      .addCase(fetchAllTasks.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default tasksSlice.reducer;

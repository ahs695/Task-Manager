import { createSlice } from "@reduxjs/toolkit";
import { fetchTaskAssignments } from "./taskAssignmentAPI";

const taskAssignmentsSlice = createSlice({
  name: "taskAssignments",
  initialState: {
    assignments: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTaskAssignments.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTaskAssignments.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.assignments = action.payload;
      })
      .addCase(fetchTaskAssignments.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default taskAssignmentsSlice.reducer;

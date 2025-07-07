// Redux/Users/userSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { fetchAllUsers } from "./userAPI";
import { fetchUnassignedUsers } from "./userAPI";

const userSlice = createSlice({
  name: "users",
  initialState: {
    allUsers: [],
    unassignedUsers: [],
    status: "idle",
    unassignedStatus: "idle",
    error: null,
    unassignedError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // All users
      .addCase(fetchAllUsers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.allUsers = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // Unassigned users
      .addCase(fetchUnassignedUsers.pending, (state) => {
        state.unassignedStatus = "loading";
        state.unassignedError = null;
      })
      .addCase(fetchUnassignedUsers.fulfilled, (state, action) => {
        state.unassignedStatus = "succeeded";
        state.unassignedUsers = action.payload;
      })
      .addCase(fetchUnassignedUsers.rejected, (state, action) => {
        state.unassignedStatus = "failed";
        state.unassignedError = action.payload;
      });
  },
});

export default userSlice.reducer;

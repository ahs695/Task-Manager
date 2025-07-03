import { createSlice } from "@reduxjs/toolkit";
import { loginUser, logoutUser } from "./authAPI";
import { jwtDecode } from "jwt-decode";

// Get token and decode if available
const initialToken = localStorage.getItem("token");
let decoded = null;

if (initialToken) {
  try {
    decoded = jwtDecode(initialToken);
  } catch {
    localStorage.removeItem("token");
  }
}

const initialState = {
  isAuthenticated: !!decoded,
  token: initialToken || null,
  role: decoded?.role || null,
  permissions: decoded?.permissions || [],

  status: "idle",
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.role = action.payload.role;
        state.permissions = action.payload.permissions;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.token = null;
        state.role = null;
        state.status = "idle";
        state.error = null;
        state.permissions = [];
      });
  },
});

export default authSlice.reducer;

// Redux/Auth/authAPI.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

// LOGIN
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        credentials
      );
      const token = res.data.token;
      localStorage.setItem("token", token);

      const decoded = jwtDecode(token);

      return {
        token,
        role: decoded.role,
        permissions: decoded.permissions || [],
        organization: decoded.organization || null,
      };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  localStorage.removeItem("token");
  return true;
});

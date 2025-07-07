// Redux/Users/userAPI.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchAllUsers = createAsyncThunk(
  "users/fetchAllUsers",
  async (_, { getState }) => {
    const token = getState().auth.token;

    const response = await axios.get("http://localhost:5000/api/auth", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  }
);

export const fetchUnassignedUsers = createAsyncThunk(
  "users/fetchUnassignedUsers",
  async (_, { getState, rejectWithValue }) => {
    const token = getState().auth.token;

    try {
      const res = await axios.get("http://localhost:5000/api/auth/unassigned", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch unassigned users"
      );
    }
  }
);

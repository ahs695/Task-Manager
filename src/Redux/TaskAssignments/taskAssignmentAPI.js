import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchTaskAssignments = createAsyncThunk(
  "taskAssignments/fetchTaskAssignments",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("http://localhost:5000/api/task-assignments");
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Failed to fetch task assignments"
      );
    }
  }
);

import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchAllTasks = createAsyncThunk(
  "tasks/fetchAllTasks",
  async (_, { getState }) => {
    const { auth } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    };

    const response = await axios.get("http://localhost:5000/api/tasks", config);
    return response.data;
  }
);

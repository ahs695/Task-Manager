import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchAllProjects = createAsyncThunk(
  "projects/fetchAllProjects",
  async (_, { getState }) => {
    const { auth } = getState();
    const config = {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    };

    // Only send userId if user is not admin/superAdmin
    if (!["admin", "superAdmin"].includes(auth.role)) {
      config.params = {
        userId: auth.token?.id,
      };
    }

    const response = await axios.get(
      "http://localhost:5000/api/projects",
      config
    );
    return response.data;
  }
);

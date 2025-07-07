import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchAllOrganizations = createAsyncThunk(
  "organizations/fetchAllOrganizations",
  async (_, { getState }) => {
    const { auth } = getState();
    const config = {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    };

    const response = await axios.get(
      "http://localhost:5000/api/organizations",
      config
    );
    return response.data;
  }
);

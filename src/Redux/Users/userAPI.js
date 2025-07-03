// Redux/Users/userAPI.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchAllUsers = createAsyncThunk(
  "users/fetchAllUsers",
  async () => {
    const response = await axios.get("http://localhost:5000/api/auth"); // Update if your route differs
    return response.data;
  }
);

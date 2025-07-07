import { createSlice } from "@reduxjs/toolkit";
import { fetchAllOrganizations } from "./OrganizationAPI";

const organizationSlice = createSlice({
  name: "organizations",
  initialState: {
    allOrganizations: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllOrganizations.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllOrganizations.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.allOrganizations = action.payload;
      })
      .addCase(fetchAllOrganizations.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default organizationSlice.reducer;

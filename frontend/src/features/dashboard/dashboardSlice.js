import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import client from "../../api/client";

export const fetchEmployeeDashboard = createAsyncThunk("dashboard/employee", async (_, thunkAPI) => {
  try {
    const { data } = await client.get("/dashboard/employee");
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Unable to load employee dashboard");
  }
});

export const fetchManagerDashboard = createAsyncThunk("dashboard/manager", async (_, thunkAPI) => {
  try {
    const { data } = await client.get("/dashboard/manager");
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Unable to load manager dashboard");
  }
});

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    employee: null,
    manager: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployeeDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployeeDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.employee = action.payload;
      })
      .addCase(fetchEmployeeDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchManagerDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchManagerDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.manager = action.payload;
      })
      .addCase(fetchManagerDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default dashboardSlice.reducer;

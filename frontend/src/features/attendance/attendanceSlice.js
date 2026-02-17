import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import client from "../../api/client";

export const checkIn = createAsyncThunk("attendance/checkIn", async (_, thunkAPI) => {
  try {
    const { data } = await client.post("/attendance/checkin");
    return data.attendance;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Check in failed");
  }
});

export const checkOut = createAsyncThunk("attendance/checkOut", async (_, thunkAPI) => {
  try {
    const { data } = await client.post("/attendance/checkout");
    return data.attendance;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Check out failed");
  }
});

export const fetchTodayStatus = createAsyncThunk("attendance/today", async (_, thunkAPI) => {
  try {
    const { data } = await client.get("/attendance/today");
    return data.attendance;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Unable to fetch status");
  }
});

export const fetchMyHistory = createAsyncThunk("attendance/myHistory", async (params, thunkAPI) => {
  try {
    const { data } = await client.get("/attendance/my-history", { params });
    return data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Unable to fetch history");
  }
});

export const fetchMySummary = createAsyncThunk("attendance/mySummary", async (params, thunkAPI) => {
  try {
    const { data } = await client.get("/attendance/my-summary", { params });
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Unable to fetch summary");
  }
});

export const fetchAllAttendance = createAsyncThunk("attendance/all", async (params, thunkAPI) => {
  try {
    const { data } = await client.get("/attendance/all", { params });
    return data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Unable to fetch attendance");
  }
});

export const fetchTeamSummary = createAsyncThunk("attendance/teamSummary", async (params, thunkAPI) => {
  try {
    const { data } = await client.get("/attendance/summary", { params });
    return data.summary;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Unable to fetch team summary");
  }
});

const attendanceSlice = createSlice({
  name: "attendance",
  initialState: {
    today: null,
    myHistory: [],
    mySummary: null,
    allAttendance: [],
    teamSummary: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearAttendanceError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkIn.fulfilled, (state, action) => {
        state.loading = false;
        state.today = action.payload;
      })
      .addCase(checkIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(checkOut.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkOut.fulfilled, (state, action) => {
        state.loading = false;
        state.today = action.payload;
      })
      .addCase(checkOut.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchTodayStatus.fulfilled, (state, action) => {
        state.today = action.payload;
      })
      .addCase(fetchMyHistory.fulfilled, (state, action) => {
        state.myHistory = action.payload;
      })
      .addCase(fetchMySummary.fulfilled, (state, action) => {
        state.mySummary = action.payload;
      })
      .addCase(fetchAllAttendance.fulfilled, (state, action) => {
        state.allAttendance = action.payload;
      })
      .addCase(fetchTeamSummary.fulfilled, (state, action) => {
        state.teamSummary = action.payload;
      });
  },
});

export const { clearAttendanceError } = attendanceSlice.actions;
export default attendanceSlice.reducer;

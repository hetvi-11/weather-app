import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchCurrentWeather } from "./weatherAPI";
import { fetchForecast } from "./weatherAPI";

export const getForecast = createAsyncThunk(
  "weather/getForecast",
  async ({ city, unit }) => {
    const data = await fetchForecast(city, unit);
    return { city, data };
  }
);

export const getCurrentWeather = createAsyncThunk(
  "weather/getCurrentWeather",
  async ({ city, unit }) => {
    const data = await fetchCurrentWeather(city, unit);
    return { city, data };
  }
);

const weatherSlice = createSlice({
  name: "weather",
  initialState: {
  data: {},
  forecast: {}, // ✅ NEW
  status: "idle",
  error: null,
},

  reducers: {
    // ✅ NEW: remove city from dashboard
    removeCity(state, action) {
      delete state.data[action.payload];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCurrentWeather.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getCurrentWeather.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data[action.payload.city] = action.payload.data;
      })
      .addCase(getCurrentWeather.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(getForecast.fulfilled, (state, action) => {
  state.forecast[action.payload.city] = action.payload.data;
});
  },
});

// ✅ export the new action
export const { removeCity } = weatherSlice.actions;

export default weatherSlice.reducer;

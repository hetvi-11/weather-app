import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  unit: localStorage.getItem("unit") || "metric", // metric = °C
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    toggleUnit(state) {
      state.unit = state.unit === "metric" ? "imperial" : "metric";
      localStorage.setItem("unit", state.unit);
    },
  },
});

export const { toggleUnit } = settingsSlice.actions;
export default settingsSlice.reducer;

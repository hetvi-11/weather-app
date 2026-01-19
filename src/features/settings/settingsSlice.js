import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  unit: "metric", // 'metric' = Celsius, 'imperial' = Fahrenheit
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    toggleUnit(state) {
      state.unit = state.unit === "metric" ? "imperial" : "metric";
    },
  },
});

export const { toggleUnit } = settingsSlice.actions;
export default settingsSlice.reducer;

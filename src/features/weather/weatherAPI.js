import axios from "axios";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";

export const fetchCurrentWeather = async (city, unit) => {
  const response = await axios.get(`${BASE_URL}/weather`, {
    params: {
      q: city,
      units: unit,
      appid: API_KEY,
    },
  });

  return response.data;
};

export const fetchForecast = async (city, unit) => {
  const response = await axios.get(`${BASE_URL}/forecast`, {
    params: {
      q: city,
      units: unit,
      appid: API_KEY,
    },
  });

  return response.data;
};

export const fetchUVIndex = async (lat, lon) => {
  const response = await axios.get(
    "https://api.openweathermap.org/data/2.5/uvi",
    {
      params: {
        lat,
        lon,
        appid: API_KEY,
      },
    }
  );
  return response.data;
};



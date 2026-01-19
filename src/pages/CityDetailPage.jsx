import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { getForecast } from "../features/weather/weatherSlice";
import { fetchUVIndex } from "../features/weather/weatherAPI";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function CityDetailPage() {
  const { cityName } = useParams();
  const dispatch = useDispatch();
  const unit = useSelector((state) => state.settings.unit);
  const [uv, setUv] = useState(null);
  const unitSymbol = unit === "metric" ? "°C" : "°F";

  const current = useSelector(
    (state) => state.weather.data[cityName]
  );
  const forecast = useSelector(
    (state) => state.weather.forecast[cityName]
  );

  useEffect(() => {
    dispatch(getForecast({ city: cityName, unit }));
  }, [cityName, unit]);

  useEffect(() => {
    if (current) {
      fetchUVIndex(current.coord.lat, current.coord.lon)
        .then((data) => setUv(data.value));
    }
  }, [current]);

  if (!current || !forecast) {
    return <p style={{ padding: "20px" }}>Loading forecast...</p>;
  }

  /* ------------------ DATA PREPARATION ------------------ */

  const hourlyData = forecast.list.slice(0, 8).map((item) => ({
    time: new Date(item.dt * 1000).getHours() + ":00",
    temp: Math.round(item.main.temp),
    wind: item.wind.speed,
    precipitation:
      (item.rain && item.rain["3h"]) ||
      (item.snow && item.snow["3h"]) ||
      0,
  }));

  const dailyData = Object.values(
    forecast.list.reduce((days, item) => {
      const date = new Date(item.dt * 1000).toDateString();
      if (!days[date]) {
        days[date] = {
          date,
          temp: Math.round(item.main.temp),
        };
      }
      return days;
    }, {})
  ).slice(0, 5);

  /* ------------------ UI ------------------ */

  return (
    <div style={{ padding: "20px" }}>
      <h1>{current.name}</h1>
      <h2>{Math.round(current.main.temp)}{unitSymbol}</h2>

      {/* -------- Detailed Stats -------- */}
      <h3>Detailed Stats</h3>
      <p>Feels Like: {Math.round(current.main.feels_like)}°</p>
      <p>Pressure: {current.main.pressure} hPa</p>
      <p>Humidity: {current.main.humidity}%</p>
      <p>
        Dew Point:{" "}
        {Math.round(
          current.main.temp - (100 - current.main.humidity) / 5
        )}
        °
      </p>
      <p>Wind Speed: {current.wind.speed} m/s</p>
      <p>UV Index: {uv ?? "Loading..."}</p>

      {/* -------- Hourly Forecast Cards -------- */}
      <h3>Hourly Forecast (Next 24h)</h3>
      <div style={{ display: "flex", gap: "12px", overflowX: "auto" }}>
        {forecast.list.slice(0, 8).map((item) => (
          <div key={item.dt} style={hourStyle}>
            <p>{new Date(item.dt * 1000).getHours()}:00</p>
            <p>{Math.round(item.main.temp)}°</p>
            <p>{item.weather[0].main}</p>
          </div>
        ))}
      </div>

      {/* -------- Hourly Temperature Chart -------- */}
      <h3>Hourly Temperature Trend</h3>
      <div style={chartContainer}>
        <ResponsiveContainer>
          <LineChart data={hourlyData}>
            <CartesianGrid />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="temp" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* -------- Wind Speed Chart -------- */}
      <h3>Hourly Wind Speed</h3>
      <div style={chartContainer}>
        <ResponsiveContainer>
          <LineChart data={hourlyData}>
            <CartesianGrid />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="wind" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* -------- Precipitation Chart -------- */}
      <h3>Hourly Precipitation</h3>
      <div style={chartContainer}>
        <ResponsiveContainer>
          <BarChart data={hourlyData}>
            <CartesianGrid />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="precipitation" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* -------- 5-Day Forecast -------- */}
      <h3>5-Day Forecast</h3>
      <div style={{ display: "flex", gap: "16px" }}>
        {dailyData.map((item) => (
          <div key={item.date} style={dayStyle}>
            <p>{item.date}</p>
            <p>{item.temp}°</p>
          </div>
        ))}
      </div>

      {/* -------- 5-Day Temperature Chart -------- */}
      <h3>5-Day Temperature Trend</h3>
      <div style={chartContainer}>
        <ResponsiveContainer>
          <LineChart data={dailyData}>
            <CartesianGrid />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="temp" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/* ------------------ STYLES ------------------ */

const hourStyle = {
  border: "1px solid #ddd",
  padding: "8px",
  minWidth: "80px",
  textAlign: "center",
};

const dayStyle = {
  border: "1px solid #ddd",
  padding: "12px",
  minWidth: "140px",
  textAlign: "center",
};

const chartContainer = {
  width: "100%",
  height: "320px",
  marginBottom: "40px",
};

export default CityDetailPage;

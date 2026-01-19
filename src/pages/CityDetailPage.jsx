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
import WeatherIcon from "../components/WeatherIcon";

function CityDetailPage() {
  const { cityName } = useParams();
  const dispatch = useDispatch();
  const unit = useSelector((state) => state.settings.unit);
  const unitSymbol = unit === "metric" ? "°C" : "°F";
  const [uv, setUv] = useState(null);

  const current = useSelector((state) => state.weather.data[cityName]);
  const forecast = useSelector((state) => state.weather.forecast[cityName]);

  useEffect(() => {
    dispatch(getForecast({ city: cityName, unit }));
  }, [cityName, unit]);

  useEffect(() => {
    if (current) {
      fetchUVIndex(current.coord.lat, current.coord.lon).then((data) =>
        setUv(data.value),
      );
    }
  }, [current]);

  if (!current || !forecast) {
    return <p className="app-container">Loading forecast...</p>;
  }

  const hourlyData = forecast.list.slice(0, 8).map((item) => ({
    time: new Date(item.dt * 1000).getHours() + ":00",
    temp: Math.round(item.main.temp),
    wind: item.wind.speed,
    precipitation:
      (item.rain && item.rain["3h"]) || (item.snow && item.snow["3h"]) || 0,
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
    }, {}),
  ).slice(0, 5);


  return (
    <div className="app-container">
      <div className="detail-header">
        <h1>{current.name}</h1>
        <div className="detail-temp">
          {Math.round(current.main.temp)}
          {unitSymbol}
        </div>
        <WeatherIcon icon={current.weather[0].icon} size={80} />
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Feels Like</div>
          <div className="stat-value">
            {Math.round(current.main.feels_like)}
            {unitSymbol}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Humidity</div>
          <div className="stat-value">{current.main.humidity}%</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Pressure</div>
          <div className="stat-value">{current.main.pressure} hPa</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Wind Speed</div>
          <div className="stat-value">{current.wind.speed} m/s</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">UV Index</div>
          <div className="stat-value">{uv ?? "Loading"}</div>
        </div>
      </div>

      <h3>Hourly Forecast</h3>
      <div className="hourly-scroll">
        {forecast.list.slice(0, 8).map((item) => (
          <div key={item.dt} className="hour-card">
            <div>{new Date(item.dt * 1000).getHours()}:00</div>
            <WeatherIcon icon={item.weather[0].icon} size={40} />
            <strong>
              {Math.round(item.main.temp)}
              {unitSymbol}
            </strong>
            <div>{item.weather[0].main}</div>
          </div>
        ))}
      </div>

      <h3>Hourly Temperature Trend</h3>
      <div className="chart-box">
        <ResponsiveContainer height={300}>
          <LineChart data={hourlyData}>
            <CartesianGrid />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="temp" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <h3>Hourly Wind Speed</h3>
      <div className="chart-box">
        <ResponsiveContainer height={300}>
          <LineChart data={hourlyData}>
            <CartesianGrid />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="wind" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <h3>Hourly Precipitation</h3>
      <div className="chart-box">
        <ResponsiveContainer height={300}>
          <BarChart data={hourlyData}>
            <CartesianGrid />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="precipitation" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <h3>5-Day Forecast</h3>
      <div className="hourly-scroll">
        {dailyData.map((item) => (
          <div key={item.date} className="hour-card">
            <div>{item.date}</div>
            <strong>
              {item.temp}
              {unitSymbol}
            </strong>
          </div>
        ))}
      </div>

      <h3>5-Day Temperature Trend</h3>
      <div className="chart-box">
        <ResponsiveContainer height={300}>
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

export default CityDetailPage;

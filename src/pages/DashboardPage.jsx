import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CityCard from "../components/CityCard/CityCard";
import SearchBar from "../components/SearchBar/searchBar";
import { getCurrentWeather } from "../features/weather/weatherSlice";
import { toggleUnit } from "../features/settings/settingsSlice";

const DEFAULT_CITIES = ["London", "New York", "Tokyo"];

function DashboardPage() {
  const dispatch = useDispatch();
  const unit = useSelector((state) => state.settings.unit);
  const weatherData = useSelector((state) => state.weather.data);
  const favorites = useSelector((state) => state.favorites.cities);

  const allCities = Object.keys(weatherData);

  const sortedCities = [
    ...allCities.filter((c) => favorites.includes(c)),
    ...allCities.filter((c) => !favorites.includes(c)),
  ];

  // ✅ LOAD DATA ON FIRST MOUNT
  useEffect(() => {
    if (favorites.length > 0) {
      // Load persisted favorite cities
      favorites.forEach((city) => {
        dispatch(getCurrentWeather({ city, unit }));
      });
    } else {
      // No favorites → load defaults
      DEFAULT_CITIES.forEach((city) => {
        dispatch(getCurrentWeather({ city, unit }));
      });
    }
  }, []);

  // Refetch all visible cities when unit changes
  useEffect(() => {
    allCities.forEach((city) => {
      dispatch(getCurrentWeather({ city, unit }));
    });
  }, [unit]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Weather Dashboard</h1>
      <button
        onClick={() => dispatch(toggleUnit())}
        style={{ marginBottom: "16px" }}
        >
        Switch to {unit === "metric" ? "°F" : "°C"}
      </button>

      <SearchBar />

      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
        {sortedCities.map((city) => (
          <CityCard
            key={city}
            city={city}
            data={weatherData[city]}
          />
        ))}
      </div>
    </div>
  );
}

export default DashboardPage;

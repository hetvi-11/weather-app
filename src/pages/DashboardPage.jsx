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


  useEffect(() => {
    if (favorites.length > 0) {
      favorites.forEach((city) => {
        dispatch(getCurrentWeather({ city, unit }));
      });
    } else {
      DEFAULT_CITIES.forEach((city) => {
        dispatch(getCurrentWeather({ city, unit }));
      });
    }
  }, []);


  useEffect(() => {
    allCities.forEach((city) => {
      dispatch(getCurrentWeather({ city, unit }));
    });
  }, [unit]);

  return (
    <div className="app-container">
      <h1 className="page-title">Weather Dashboard</h1>

      <button onClick={() => dispatch(toggleUnit())} style={{ marginBottom: "16px" }}>
        Switch to {unit === "metric" ? "°F" : "°C"}
      </button>


      <SearchBar />

      <div className="card-grid">
        {sortedCities.map((city) => (
          <CityCard key={city} city={city} data={weatherData[city]} />
        ))}
      </div>
    </div>
  );
}

export default DashboardPage;

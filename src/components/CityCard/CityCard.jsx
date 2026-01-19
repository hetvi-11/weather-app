import { useDispatch, useSelector } from "react-redux";
import {
  addFavorite,
  removeFavorite,
} from "../../features/favorites/favoritesSlice";
import { useNavigate } from "react-router-dom";
import { removeCity } from "../../features/weather/weatherSlice";
import WeatherIcon from "../WeatherIcon";

function CityCard({ city, data }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const favorites = useSelector((state) => state.favorites.cities);

  const isFavorite = favorites.includes(city);

  if (!data) {
    return (
      <div className="city-card">
        <h3 className="city-name">{city}</h3>
        <p>Loading...</p>
      </div>
    );
  }

  const toggleFavorite = (e) => {
    e.stopPropagation();
    if (isFavorite) {
      dispatch(removeFavorite(city));
    } else {
      dispatch(addFavorite(city));
    }
  };

  const removeCityCard = (e) => {
    e.stopPropagation();
    dispatch(removeCity(city));
    dispatch(removeFavorite(city)); 
  };

  return (
    <div className="city-card" onClick={() => navigate(`/city/${city}`)}>
     
      <div className="city-card-header">
        <span className="city-name">{data.name}</span>

        <button
          className="favorite-btn"
          onClick={toggleFavorite}
          aria-label="Toggle favorite"
        >
          {isFavorite ? "★" : "☆"}
        </button>
      </div>
      <WeatherIcon icon={data.weather[0].icon} size={56} />


      <div className="city-temp">{Math.round(data.main.temp)}°</div>

      <div className="city-meta">{data.weather[0].main}</div>
      <div className="city-meta">Humidity {data.main.humidity}%</div>
      <div className="city-meta">Wind {data.wind.speed} m/s</div>

      <button
        onClick={removeCityCard}
        style={{
          marginTop: "12px",
          background: "#864b1b",
        }}
      >
        Remove
      </button>
    </div>
  );
}

export default CityCard;

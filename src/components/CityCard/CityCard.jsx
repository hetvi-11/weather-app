import { useDispatch, useSelector } from "react-redux";
import {
  addFavorite,
  removeFavorite,
} from "../../features/favorites/favoritesSlice";
import { useNavigate } from "react-router-dom";
import { removeCity } from "../../features/weather/weatherSlice";

function CityCard({ city, data }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const favorites = useSelector((state) => state.favorites.cities);

  const isFavorite = favorites.includes(city);

  if (!data) {
    return (
      <div style={cardStyle}>
        <h3>{city}</h3>
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
    dispatch(removeFavorite(city)); // cleanup
  };

  return (
    <div
      style={cardStyle}
      onClick={() => navigate(`/city/${city}`)}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h3>{data.name}</h3>
        <button onClick={toggleFavorite}>
          {isFavorite ? "★" : "☆"}
        </button>
      </div>

      <h2>{Math.round(data.main.temp)}°</h2>
      <p>{data.weather[0].main}</p>
      <p>Humidity: {data.main.humidity}%</p>
      <p>Wind: {data.wind.speed} m/s</p>

      <button onClick={removeCityCard}>Remove</button>
    </div>
  );
}

const cardStyle = {
  border: "1px solid #ddd",
  borderRadius: "8px",
  padding: "16px",
  width: "220px",
  cursor: "pointer",
};

export default CityCard;

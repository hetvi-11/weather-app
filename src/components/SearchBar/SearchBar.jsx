import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentWeather } from "../../features/weather/weatherSlice";

function SearchBar() {
  const [city, setCity] = useState("");
  const dispatch = useDispatch();
  const unit = useSelector((state) => state.settings.unit);

  const handleSearch = () => {
    if (!city) return;
    dispatch(getCurrentWeather({ city, unit }));
    setCity("");
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      <input
        type="text"
        placeholder="Search city..."
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
}

export default SearchBar;

function WeatherIcon({ icon, size = 48 }) {
  if (!icon) return null;

  return (
    <img
      src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
      alt="weather icon"
      width={size}
      height={size}
      style={{ display: "block" }}
    />
  );
}

export default WeatherIcon;

import { Routes, Route } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import CityDetailPage from "./pages/CityDetailPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/city/:cityName" element={<CityDetailPage />} />
    </Routes>
  );
}

export default App;

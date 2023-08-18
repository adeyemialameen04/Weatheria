import axios from "axios";
import { useState } from "react";
import { ICONS_URLS } from "./icons";
import Forecasting from "./Forecasting";
import { AiOutlineSearch } from "react-icons/ai";

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [forecastData, setForecastData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [weatherData, setWeatherData] = useState(null);

  const getWeatherData = async () => {
    const API_KEY = import.meta.env.VITE_REACT_WEATHER_API_KEY;
    const URL = "https://api.openweathermap.org/data/2.5/weather";
    const FULL_URL = `${URL}?q=${searchQuery}&appid=${API_KEY}&units=imperial`;

    try {
      if (searchQuery !== "") {
        const response = await axios.get(FULL_URL);
        setLoading(true);
        if (response.status === 200) {
          setLoading(false);
          setWeatherData(response.data);
          getForecastingData(response?.data.coord);
          setErrorMessage("");
          return response.data;
        }
      }
    } catch (error) {
      setLoading(false);
      if (error.response && error.response.status === 404) {
        setWeatherData(null);
        setErrorMessage("Weather data not available for this location.");
      } else {
        setWeatherData(null);
        setErrorMessage("An error occurred while fetching weather data.");
      }
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(e.target.value);
  };

  const handlekeyDown = (e) => {
    if (e.code === "Enter") {
      e.preventDefault();
      getWeatherData();
    }
  };

  const getForecastingData = async (coords) => {
    const API_KEY = import.meta.env.VITE_REACT_WEATHER_API_KEY;
    const URL = "https://api.openweathermap.org/data/2.5/forecast";
    const FULL_URL = `${URL}?lat=${coords.lat}&lon=${coords.lon}&appid=${API_KEY}&units=metric`;

    try {
      if (searchQuery !== "") {
        setLoading(true);
        const response = await axios.get(FULL_URL);
        const data = await response.data;
        if (response.status === 200) {
          setLoading(false);
          const dailyForecasts = data?.list?.filter((item) =>
            item.dt_txt.includes("12:00")
          );
          setForecastData(dailyForecasts);
          setErrorMessage("");
        }
      }
    } catch (error) {
      setLoading(false);
      if (error.response && error.response.status === 404) {
        setForecastData(null);
        setErrorMessage("Weather data not available for this location.");
      } else {
        setForecastData(null);
        setErrorMessage("An error occurred while fetching weather data.");
      }
    }
  };

  return (
    <main className="home">
      <nav className="nav">
        <div className="container nav__container">
          <input
            type="text"
            value={searchQuery}
            placeholder="Search for city"
            onChange={handleSearch}
            onKeyDown={handlekeyDown}
          />
          <button onClick={getWeatherData}>
            <AiOutlineSearch />
          </button>
          {errorMessage && <h1>{errorMessage}</h1>}
        </div>
      </nav>
      <>
        {weatherData && (
          <section className="weather__section container">
            <div>
              <div>
                <h1>{weatherData?.name}</h1>
                <span>{weatherData?.weather[0]?.description}</span>
              </div>
              <img
                src={ICONS_URLS[weatherData?.weather[0]?.icon]}
                alt="Weather description"
              />
            </div>
            <div>
              <h1>{weatherData?.main?.temp}°C</h1>
              <div>
                <h2>Details</h2>
                <article>
                  <p>Feels like</p>
                  <small>{weatherData?.main?.feels_like}°C</small>
                </article>
                <article>
                  <p>Humidity</p>
                  <small>{weatherData?.main?.humidity}°C</small>
                </article>
                <article>
                  <p>Pressure</p>
                  <small>{weatherData?.main?.pressure}°C</small>
                </article>
              </div>
            </div>
          </section>
        )}
      </>
      <>
        {forecastData.length !== 0 && (
          <Forecasting forecastData={forecastData} />
        )}
      </>
    </main>
  );
}

export default App;

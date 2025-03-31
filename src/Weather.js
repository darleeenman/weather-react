import React, { useState, useEffect } from "react";
import "./Weather.css";
import axios from "axios";
import WeatherInfo from "./WeatherInfo";
import WeatherForecast from "./WeatherForecast";

export default function Weather(props) {
  const [weatherData, setWeatherData] = useState({ ready: false });
  const [city, setCity] = useState(props.defaultCity);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!weatherData.ready) {
      search();
    }
  }, [weatherData.ready]);

  function handleResponse(response) {
    setWeatherData({
      ready: true,
      coordinates: response.data.coord,
      temperature: response.data.main.temp,
      humidity: response.data.main.humidity,
      date: new Date(response.data.dt * 1000),
      description: response.data.weather[0].description,
      icon: response.data.weather[0].icon,
      wind: response.data.wind.speed,
      city: response.data.name,
    });
    setError(null);
  }

  function handleError(error) {
    if (error.response) {
      if (error.response.status === 404) {
        setError("City not found. Please try another city name.");
      } else if (error.response.status === 401) {
        setError("API key error. Please try again later.");
      } else {
        setError("An error occurred. Please try again later.");
      }
    } else if (error.request) {
      setError(
        "No response from server. Please check your internet connection."
      );
    } else {
      setError("An error occurred. Please try again later.");
    }
    setWeatherData({ ready: false });
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!city.trim()) {
      setError("Please enter a city name.");
      return;
    }
    setWeatherData({ ready: false });
    search();
  }

  function handleCityChange(event) {
    setCity(event.target.value);
    setError(null);
  }

  function search() {
    const apiKey = "0d78d3d987e492a289265ccd0e1ddc36";
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      city
    )}&appid=${apiKey}&units=imperial`;
    axios.get(apiUrl).then(handleResponse).catch(handleError);
  }

  if (weatherData.ready) {
    return (
      <div className="Weather">
        <form onSubmit={handleSubmit} className="search-form">
          <div className="search-container">
            <input
              type="search"
              placeholder="Enter a city.."
              className="search-input"
              autoFocus="on"
              onChange={handleCityChange}
              value={city}
            />
            <button type="submit" className="search-button">
              Search
            </button>
          </div>
        </form>
        {error && <div className="error-message">{error}</div>}
        <WeatherInfo data={weatherData} />
        <WeatherForecast coordinates={weatherData.coordinates} />
      </div>
    );
  } else {
    return <div className="loading">Loading...</div>;
  }
}

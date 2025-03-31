import React, { useState, useEffect, useCallback } from "react";
import "./Weather.css";
import axios from "axios";
import WeatherInfo from "./WeatherInfo";
import WeatherForecast from "./WeatherForecast";

export default function Weather(props) {
  let [weatherData, setWeatherData] = useState({ ready: false });
  let [city, setCity] = useState(props.defaultCity);
  let [error, setError] = useState(null);
  let [isLoading, setIsLoading] = useState(false);
  let [lastRequestTime, setLastRequestTime] = useState(0);

  const handleResponse = useCallback((response) => {
    setWeatherData({
      ready: true,
      coordinates: response.data.coord,
      temperature: response.data.main.temp,
      humidity: response.data.main.humidity,
      description: response.data.weather[0].description,
      icon: response.data.weather[0].icon,
      wind: response.data.wind.speed,
      city: response.data.name,
      date: new Date(response.data.dt * 1000),
    });
    setError(null);
    setIsLoading(false);
  }, []);

  const handleError = useCallback((error) => {
    if (error.response) {
      if (error.response.status === 429) {
        setError(
          "Too many requests. Please wait a few minutes before trying again."
        );
      } else if (error.response.status === 404) {
        setError("City not found. Please check the spelling and try again.");
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
    setIsLoading(false);
  }, []);

  const search = useCallback(() => {
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;

    // If less than 2 seconds since last request, wait
    if (timeSinceLastRequest < 2000) {
      setError("Please wait a moment before searching again.");
      return;
    }

    setIsLoading(true);
    setLastRequestTime(now);

    const apiKey = "b05cde912d67b744d66a05c658a57e27";
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    axios.get(apiUrl).then(handleResponse).catch(handleError);
  }, [city, lastRequestTime, handleResponse, handleError]);

  useEffect(() => {
    if (!weatherData.ready) {
      search();
    }
  }, [weatherData.ready, search]);

  function handleSubmit(event) {
    event.preventDefault();
    if (city.trim() === "") {
      setError("Please enter a city name");
      return;
    }
    setWeatherData({ ready: false });
    search();
  }

  function handleCityChange(event) {
    setCity(event.target.value);
    setError(null);
  }

  if (weatherData.ready) {
    return (
      <div className="Weather">
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-9">
              <input
                type="text"
                placeholder="Enter a city..."
                className="form-control"
                onChange={handleCityChange}
                defaultValue={city}
              />
            </div>
            <div className="col-3">
              <input
                type="submit"
                value={isLoading ? "Searching..." : "Search"}
                className="btn btn-primary w-100"
                disabled={isLoading}
              />
            </div>
          </div>
        </form>
        {error && <div className="error-message">{error}</div>}
        <WeatherInfo data={weatherData} />
        <WeatherForecast coordinates={weatherData.coordinates} />
      </div>
    );
  } else {
    return (
      <div className="Weather">
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-9">
              <input
                type="text"
                placeholder="Enter a city..."
                className="form-control"
                onChange={handleCityChange}
                defaultValue={city}
              />
            </div>
            <div className="col-3">
              <input
                type="submit"
                value={isLoading ? "Searching..." : "Search"}
                className="btn btn-primary w-100"
                disabled={isLoading}
              />
            </div>
          </div>
        </form>
        {error && <div className="error-message">{error}</div>}
        <div className="loading-message">Loading weather data...</div>
      </div>
    );
  }
}

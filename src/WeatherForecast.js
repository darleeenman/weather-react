import React, { useState, useEffect } from "react";
import "./WeatherForecast.css";
import axios from "axios";
import WeatherForecastDay from "./WeatherForecastDay";

export default function WeatherForecast(props) {
  let [loaded, setLoaded] = useState(false);
  let [forecast, setForecast] = useState(null);
  let [error, setError] = useState(null);
  let [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setLoaded(false);
    setError(null);
    setIsLoading(true);
  }, [props.coordinates]);

  function handleResponse(response) {
    setForecast(response.data.list);
    setLoaded(true);
    setError(null);
    setIsLoading(false);
  }

  function handleError(error) {
    if (error.response) {
      if (error.response.status === 429) {
        setError("Too many requests. Please wait a moment and try again.");
      } else if (error.response.status === 401) {
        setError("API key error. Please try again later.");
      } else {
        setError("Unable to load forecast data. Please try again later.");
      }
    } else if (error.request) {
      setError(
        "No response from server. Please check your internet connection."
      );
    } else {
      setError("Unable to load forecast data. Please try again later.");
    }
    setLoaded(true);
    setIsLoading(false);
  }

  function load() {
    let apiKey = "b05cde912d67b744d66a05c658a57e27";
    let longitude = props.coordinates.lon;
    let latitude = props.coordinates.lat;
    let apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=imperial`;

    axios.get(apiUrl).then(handleResponse).catch(handleError);
  }

  if (loaded) {
    if (error) {
      return <div className="error-message">{error}</div>;
    }

    return (
      <div className="WeatherForecast">
        <h3>5-Day Forecast</h3>
        <div className="row">
          {forecast.map(function (dailyForecast, index) {
            if (index < 5) {
              return (
                <div className="col" key={index}>
                  <WeatherForecastDay data={dailyForecast} />
                </div>
              );
            } else {
              return null;
            }
          })}
        </div>
      </div>
    );
  } else {
    if (isLoading) {
      load();
      return <div className="loading">Loading forecast data...</div>;
    }
    return null;
  }
}

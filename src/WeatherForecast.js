import React, { useState, useEffect, useCallback } from "react";
import "./WeatherForecast.css";
import axios from "axios";
import WeatherForecastDay from "./WeatherForecastDay";

export default function WeatherForecast({ coordinates }) {
  let [loaded, setLoaded] = useState(false);
  let [forecast, setForecast] = useState(null);
  let [error, setError] = useState(null);
  let [loading, setLoading] = useState(false);
  let [lastRequestTime, setLastRequestTime] = useState(0);

  const handleResponse = useCallback((response) => {
    if (!response || !response.data) {
      setError("Invalid response from server");
      return;
    }

    try {
      setForecast(response.data);
      setError(null);
    } catch (err) {
      setError("Error processing forecast data");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleError = useCallback((error) => {
    if (error.response) {
      if (error.response.status === 429) {
        setError(
          "Too many requests. Please wait a few minutes before trying again."
        );
      } else if (error.response.status === 404) {
        setError("Forecast data not available for this location.");
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
    setLoading(false);
  }, []);

  const load = useCallback(() => {
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;

    // If less than 2 seconds since last request, wait
    if (timeSinceLastRequest < 2000) {
      setError("Please wait a moment before searching again.");
      return;
    }

    setLoading(true);
    setLastRequestTime(now);

    const apiKey = "b05cde912d67b744d66a05c658a57e27";
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;

    axios
      .get(apiUrl, {
        timeout: 10000, // 10 second timeout
        headers: {
          Accept: "application/json",
        },
      })
      .then(handleResponse)
      .catch(handleError);
  }, [coordinates, lastRequestTime, handleResponse, handleError]);

  useEffect(() => {
    let mounted = true;

    if (mounted && coordinates) {
      setLoaded(true);
      load();
    }

    return () => {
      mounted = false;
    };
  }, [coordinates, load]);

  if (!loaded) {
    return null;
  }

  if (loading) {
    return <div className="loading-message">Loading forecast...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!forecast) {
    return null;
  }

  return (
    <div className="WeatherForecast">
      <h3>5-Day Forecast</h3>
      <div className="row">
        {forecast.list.slice(0, 5).map((item, index) => (
          <div className="col" key={index}>
            <WeatherForecastDay data={item} />
          </div>
        ))}
      </div>
    </div>
  );
}

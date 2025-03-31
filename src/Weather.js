import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./Weather.css";
import axios from "axios";
import WeatherInfo from "./WeatherInfo";
import WeatherForecast from "./WeatherForecast";

export default function Weather(props) {
  const dispatch = useDispatch();
  const { background, loading, error } = useSelector((state) => state);
  let [city, setCity] = useState(props.defaultCity);
  let [lastRequestTime, setLastRequestTime] = useState(0);
  let [retryAfter, setRetryAfter] = useState(null);

  const handleResponse = useCallback(
    (response) => {
      if (!response || !response.data) {
        dispatch({
          type: "SET_ERROR",
          payload: "Invalid response from server",
        });
        return;
      }

      try {
        dispatch({
          type: "SET_WEATHER",
          payload: response.data,
        });
        setRetryAfter(null);
      } catch (err) {
        dispatch({
          type: "SET_ERROR",
          payload: "Error processing weather data",
        });
      }
    },
    [dispatch]
  );

  const handleError = useCallback(
    (error) => {
      if (error.response) {
        if (error.response.status === 429) {
          const retryAfterSeconds =
            parseInt(error.response.headers["retry-after"]) || 60;
          setRetryAfter(retryAfterSeconds);
          dispatch({
            type: "SET_ERROR",
            payload: `Rate limit exceeded. Please wait ${retryAfterSeconds} seconds before trying again.`,
          });
        } else if (error.response.status === 404) {
          dispatch({
            type: "SET_ERROR",
            payload: "City not found. Please check the spelling and try again.",
          });
        } else if (error.response.status === 401) {
          dispatch({
            type: "SET_ERROR",
            payload: "API key error. Please try again later.",
          });
        } else {
          dispatch({
            type: "SET_ERROR",
            payload: "An error occurred. Please try again later.",
          });
        }
      } else if (error.request) {
        dispatch({
          type: "SET_ERROR",
          payload:
            "No response from server. Please check your internet connection.",
        });
      } else {
        dispatch({
          type: "SET_ERROR",
          payload: "An error occurred. Please try again later.",
        });
      }
    },
    [dispatch]
  );

  const search = useCallback(() => {
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;

    // If less than 2 seconds since last request, wait
    if (timeSinceLastRequest < 2000) {
      dispatch({
        type: "SET_ERROR",
        payload: "Please wait a moment before searching again.",
      });
      return;
    }

    // If we're in a retry period, don't make the request
    if (retryAfter) {
      return;
    }

    dispatch({ type: "SET_LOADING", payload: true });
    setLastRequestTime(now);

    const apiKey = "b05cde912d67b744d66a05c658a57e27";
    const encodedCity = encodeURIComponent(city.trim());
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodedCity}&appid=${apiKey}&units=metric`;

    axios
      .get(apiUrl, {
        timeout: 10000, // 10 second timeout
        headers: {
          Accept: "application/json",
        },
      })
      .then(handleResponse)
      .catch(handleError)
      .finally(() => {
        dispatch({ type: "SET_LOADING", payload: false });
      });
  }, [
    city,
    lastRequestTime,
    handleResponse,
    handleError,
    dispatch,
    retryAfter,
  ]);

  useEffect(() => {
    let mounted = true;

    if (mounted) {
      search();
    }

    return () => {
      mounted = false;
    };
  }, [search]);

  useEffect(() => {
    if (retryAfter) {
      const timer = setTimeout(() => {
        setRetryAfter(null);
        dispatch({ type: "SET_ERROR", payload: null });
      }, retryAfter * 1000);
      return () => clearTimeout(timer);
    }
  }, [retryAfter, dispatch]);

  function handleSubmit(event) {
    event.preventDefault();
    if (city.trim() === "") {
      dispatch({ type: "SET_ERROR", payload: "Please enter a city name" });
      return;
    }
    if (retryAfter) {
      dispatch({
        type: "SET_ERROR",
        payload: `Please wait ${retryAfter} seconds before trying again.`,
      });
      return;
    }
    search();
  }

  function handleCityChange(event) {
    setCity(event.target.value);
    dispatch({ type: "SET_ERROR", payload: null });
  }

  const weatherData = useSelector((state) => state.weather);

  return (
    <div className="Weather" style={{ backgroundColor: background }}>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-9">
            <input
              type="text"
              placeholder="Enter a city..."
              className="form-control"
              onChange={handleCityChange}
              defaultValue={city}
              disabled={loading || retryAfter}
            />
          </div>
          <div className="col-3">
            <input
              type="submit"
              value={
                loading
                  ? "Searching..."
                  : retryAfter
                  ? `Wait ${retryAfter}s`
                  : "Search"
              }
              className="btn btn-primary w-100"
              disabled={loading || retryAfter}
            />
          </div>
        </div>
      </form>
      {error && <div className="error-message">{error}</div>}
      {weatherData && (
        <>
          <WeatherInfo data={weatherData} />
          <WeatherForecast coordinates={weatherData.coord} />
        </>
      )}
      {!weatherData && !error && (
        <div className="loading-message">Loading weather data...</div>
      )}
    </div>
  );
}

import React from "react";
import WeatherIcon from "./WeatherIcon";
import "./WeatherForecast.css";

export default function WeatherForecastDay(props) {
  function maxTemperature() {
    let temperature = Math.round(props.data.temp.max);
    return `${temperature}°`;
  }

  function minTemperature() {
    let temperature = Math.round(props.data.temp.min);
    return `${temperature}°`;
  }

  function day() {
    let date = new Date(props.data.dt * 1000);
    let day = date.getDay();

    let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return days[day];
  }

  function windSpeed() {
    return Math.round(props.data.wind_speed);
  }

  return (
    <div className="WeatherForecastDay">
      <div className="forecast-day">{day()}</div>
      <WeatherIcon code={props.data.weather[0].icon} size={42} />
      <div className="forecast-temperatures">
        <span className="forecast-temperature-max">{maxTemperature()}</span>
        <span className="forecast-temperature-min">{minTemperature()}</span>
      </div>
      <div className="forecast-details">
        <div className="forecast-humidity">
          Humidity: {props.data.humidity}%
        </div>
        <div className="forecast-wind">Wind: {windSpeed()} mph</div>
      </div>
    </div>
  );
}

import React from "react";
import "./WeatherInfo.css";

export default function WeatherInfo({ data }) {
  return (
    <div className="WeatherInfo">
      <div className="row">
        <div className="col-6">
          <div className="clearfix weather-temperature">
            <img
              src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
              alt={data.weather[0].description}
              className="float-left"
            />
            <div className="float-left">
              <strong>{Math.round(data.main.temp)}</strong>
              <span className="units">°C</span>
            </div>
          </div>
        </div>
        <div className="col-6">
          <ul>
            <li>Humidity: {data.main.humidity}%</li>
            <li>Wind: {Math.round(data.wind.speed)} km/h</li>
          </ul>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <h1>{data.name}</h1>
          <div className="weather-description">
            {data.weather[0].description}
          </div>
        </div>
      </div>
    </div>
  );
}

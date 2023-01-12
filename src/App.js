import React from "react";
import "./App.css";

export default function Weather() {
  let weatherData = {
    city: "Cerritos",
    temperature: 71,
    date: "Wed Dec 21 2PM",
    description: "Sunny",
    imgUrl: "https://ssl.gstatic.com/onebox/weather/64/sunny.png",
    humidity: 28,
    wind: 3,
  };

  return (
    <div className="Weather">
      <form className="search-form">
        <div className="row">
          <div className="col-9">
            <input type="search" placeholder="Enter City" autoComplete="off" />
          </div>
          <div className="col-3">
            <input
              type="submit"
              value="Search"
              className="btn btn-dark w-100"
            />
          </div>
        </div>
      </form>

      <div className="overview">
        <h1>{weatherData.city}</h1>
        <ul>
          <li>Last updated: {weatherData.date}</li>
          <li>{weatherData.description}</li>
        </ul>
      </div>
      <div className="row">
        <div className="col-6">
          <div className="weather-temperature">
            <img
              src={weatherData.imgUrl}
              alt={weatherData.description}
              className="float-left"
            />
            <div className="float-left">
              <strong>{weatherData.temperature}</strong>
              <span className="units">
                <a href="/">°C</a> | <a href="/">°F</a>
              </span>
            </div>
          </div>
        </div>
        <div className="col-3">
          <ul>
            <li>Humidity: {weatherData.humidity}%</li>
            <li>Wind: {weatherData.wind} mph</li>
          </ul>
        </div>
      </div>
      <footer>
        This project was coded by{" "}
        <a
          href="https://inquisitive-mermaid-0c1c3d.netlify.app"
          target="_blank"
          rel="noreferrer">
          Darleen Man
        </a>{" "}
        and is{" "}
        <a
          href="https://github.com/darleeenman/weather-react"
          target="_blank"
          rel="noreferrer">
          open-sourced on GitHub
        </a>
      </footer>
    </div>
  );
}

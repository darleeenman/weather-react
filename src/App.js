import React from "react";
import "./App.css";
import Weather from "./Weather";

export default function App() {
  return (
    <div className="App">
      <div className="container">
        <Weather defaultCity="Cerritos" />

        <footer className="d-flex justify-content-center">
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
          </a>{" "}
          and{" "}
          <a
            href="https://idyllic-quokka-319e3f.netlify.app/"
            target="_blank"
            rel="noreferrer">
            hosted on Netlify
          </a>
        </footer>
      </div>
    </div>
  );
}

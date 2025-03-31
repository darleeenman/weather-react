import React, { useEffect, useRef } from "react";

export default function WeatherIcon(props) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const size = props.size || 50;

    canvas.width = size;
    canvas.height = size;

    // Clear the canvas
    ctx.clearRect(0, 0, size, size);

    // Set the icon color to white with 30% opacity
    ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
    ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";

    // Draw the icon based on the weather code
    switch (props.code) {
      case "01d": // clear sky day
        drawSun(ctx, size);
        break;
      case "01n": // clear sky night
        drawMoon(ctx, size);
        break;
      case "02d": // few clouds day
        drawPartlyCloudy(ctx, size, true);
        break;
      case "02n": // few clouds night
        drawPartlyCloudy(ctx, size, false);
        break;
      case "03d": // scattered clouds
      case "03n":
        drawCloudy(ctx, size);
        break;
      case "04d": // broken clouds
      case "04n":
        drawBrokenClouds(ctx, size);
        break;
      case "09d": // shower rain
      case "09n":
        drawRain(ctx, size);
        break;
      case "10d": // rain day
        drawRainWithSun(ctx, size);
        break;
      case "10n": // rain night
        drawRainWithMoon(ctx, size);
        break;
      case "11d": // thunderstorm
      case "11n":
        drawThunderstorm(ctx, size);
        break;
      case "13d": // snow
      case "13n":
        drawSnow(ctx, size);
        break;
      case "50d": // mist
      case "50n":
        drawMist(ctx, size);
        break;
      default:
        drawDefault(ctx, size);
    }
  }, [props.code, props.size]);

  // Helper functions for drawing weather icons
  function drawSun(ctx, size) {
    const center = size / 2;
    const radius = size * 0.3;
    const rays = 12;
    const rayLength = size * 0.2;

    // Draw sun rays
    for (let i = 0; i < rays; i++) {
      const angle = (i * 2 * Math.PI) / rays;
      const startX = center + radius * Math.cos(angle);
      const startY = center + radius * Math.sin(angle);
      const endX = center + (radius + rayLength) * Math.cos(angle);
      const endY = center + (radius + rayLength) * Math.sin(angle);

      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.lineWidth = size * 0.05;
      ctx.stroke();
    }

    // Draw sun center
    ctx.beginPath();
    ctx.arc(center, center, radius, 0, 2 * Math.PI);
    ctx.fill();
  }

  function drawMoon(ctx, size) {
    const center = size / 2;
    const radius = size * 0.3;

    ctx.beginPath();
    ctx.arc(center, center, radius, 0, 2 * Math.PI);
    ctx.fill();

    // Draw shadow
    ctx.beginPath();
    ctx.arc(
      center - radius * 0.3,
      center - radius * 0.3,
      radius * 0.8,
      0,
      2 * Math.PI
    );
    ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
    ctx.fill();
    ctx.fillStyle = "rgba(255, 255, 255, 0.3)"; // Reset fill style
  }

  function drawCloudy(ctx, size) {
    const center = size / 2;
    const cloudRadius = size * 0.2;

    // Draw multiple clouds
    for (let i = 0; i < 3; i++) {
      const x = center + (i - 1) * cloudRadius * 1.5;
      const y = center + (i % 2) * cloudRadius * 0.5;

      ctx.beginPath();
      ctx.arc(x, y, cloudRadius, 0, 2 * Math.PI);
      ctx.fill();
    }
  }

  function drawPartlyCloudy(ctx, size, isDay) {
    if (isDay) {
      drawSun(ctx, size);
    } else {
      drawMoon(ctx, size);
    }

    // Draw a small cloud
    const center = size / 2;
    const cloudRadius = size * 0.15;

    ctx.beginPath();
    ctx.arc(
      center + cloudRadius,
      center - cloudRadius,
      cloudRadius,
      0,
      2 * Math.PI
    );
    ctx.fill();
  }

  function drawBrokenClouds(ctx, size) {
    const center = size / 2;
    const cloudRadius = size * 0.15;

    // Draw more clouds in a scattered pattern
    for (let i = 0; i < 4; i++) {
      const x = center + (i - 1.5) * cloudRadius * 1.5;
      const y = center + (i % 2) * cloudRadius * 0.5;

      ctx.beginPath();
      ctx.arc(x, y, cloudRadius, 0, 2 * Math.PI);
      ctx.fill();
    }
  }

  function drawRain(ctx, size) {
    drawCloudy(ctx, size);

    const center = size / 2;
    const rainCount = 8;

    // Draw rain drops
    for (let i = 0; i < rainCount; i++) {
      const x = center + (i - rainCount / 2) * size * 0.1;
      const y = center + size * 0.2;

      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + size * 0.15);
      ctx.lineWidth = size * 0.02;
      ctx.stroke();
    }
  }

  function drawRainWithSun(ctx, size) {
    drawSun(ctx, size);
    drawRain(ctx, size);
  }

  function drawRainWithMoon(ctx, size) {
    drawMoon(ctx, size);
    drawRain(ctx, size);
  }

  function drawThunderstorm(ctx, size) {
    drawRain(ctx, size);

    // Draw lightning
    const center = size / 2;
    ctx.beginPath();
    ctx.moveTo(center - size * 0.1, center + size * 0.2);
    ctx.lineTo(center + size * 0.1, center + size * 0.3);
    ctx.lineTo(center - size * 0.1, center + size * 0.4);
    ctx.lineWidth = size * 0.03;
    ctx.stroke();
  }

  function drawSnow(ctx, size) {
    drawCloudy(ctx, size);

    const center = size / 2;
    const snowCount = 6;

    // Draw snowflakes
    for (let i = 0; i < snowCount; i++) {
      const x = center + (i - snowCount / 2) * size * 0.1;
      const y = center + size * 0.2;

      ctx.beginPath();
      ctx.arc(x, y, size * 0.02, 0, 2 * Math.PI);
      ctx.fill();
    }
  }

  function drawMist(ctx, size) {
    const center = size / 2;
    const lines = 3;

    // Draw mist lines
    for (let i = 0; i < lines; i++) {
      const y = center + (i - 1) * size * 0.1;
      ctx.beginPath();
      ctx.moveTo(center - size * 0.3, y);
      ctx.lineTo(center + size * 0.3, y);
      ctx.lineWidth = size * 0.02;
      ctx.stroke();
    }
  }

  function drawDefault(ctx, size) {
    const center = size / 2;
    ctx.beginPath();
    ctx.arc(center, center, size * 0.3, 0, 2 * Math.PI);
    ctx.fill();
  }

  return <canvas ref={canvasRef} alt="weather icon" style={{ opacity: 0.3 }} />;
}

const initialState = {
  background: "#87CEEB", // Default sky blue
  weather: null,
  loading: false,
  error: null,
};

const weatherReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_WEATHER":
      return {
        ...state,
        weather: action.payload,
        background: getBackgroundColor(action.payload.weather[0].icon),
      };
    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
      };
    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};

const getBackgroundColor = (icon) => {
  // Weather icon codes and their corresponding background colors
  const backgrounds = {
    "01d": "#87CEEB", // Clear sky day
    "01n": "#1a1a2e", // Clear sky night
    "02d": "#b3d4fc", // Few clouds day
    "02n": "#2c3e50", // Few clouds night
    "03d": "#b3d4fc", // Scattered clouds day
    "03n": "#2c3e50", // Scattered clouds night
    "04d": "#b3d4fc", // Broken clouds day
    "04n": "#2c3e50", // Broken clouds night
    "09d": "#6c757d", // Shower rain day
    "09n": "#2c3e50", // Shower rain night
    "10d": "#6c757d", // Rain day
    "10n": "#2c3e50", // Rain night
    "11d": "#6c757d", // Thunderstorm day
    "11n": "#2c3e50", // Thunderstorm night
    "13d": "#e9ecef", // Snow day
    "13n": "#2c3e50", // Snow night
    "50d": "#b3d4fc", // Mist day
    "50n": "#2c3e50", // Mist night
  };

  return backgrounds[icon] || "#87CEEB"; // Default to sky blue if icon not found
};

export default weatherReducer;

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { WeatherState } from "./types";

const initialState: WeatherState = {
  currentWeather: null,
  hourlyForecast: [],
  dailyForecast: [],
  airQuality: null,
  uvIndex: null,
  favoriteCities: JSON.parse(localStorage.getItem("favoriteCities") || "[]"),
  searchResults: [],
  historicalData: [],
  loading: false,
  error: null,
  weatherTheme: "sunny",
};
const determineWeatherTheme = (
  weather: WeatherState["currentWeather"]
): WeatherState["weatherTheme"] => {
  if (!weather) return "sunny";
  const now = weather.dt;
  const isNight = now < weather.sunrise || now > weather.sunset;
  if (isNight) return "night";

  const main = weather.main.toLowerCase();
  if (
    main.includes("rain") ||
    main.includes("drizzle") ||
    main.includes("thunderstorm")
  )
    return "rainy";
  if (main.includes("snow")) return "snowy";
  if (main.includes("cloud") || main.includes("mist") || main.includes("fog"))
    return "cloudy";
  return "sunny";
};
const weatherSlice = createSlice({
  name: "weather",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
      if (action.payload) state.error = null;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    setWeatherBundle(
      state,
      action: PayloadAction<{
        currentWeather: WeatherState["currentWeather"];
        hourlyForecast: WeatherState["hourlyForecast"];
        dailyForecast: WeatherState["dailyForecast"];
        airQuality: WeatherState["airQuality"];
        uvIndex: number | null;
      }>
    ) {
      const {
        currentWeather,
        hourlyForecast,
        dailyForecast,
        airQuality,
        uvIndex,
      } = action.payload;
      state.currentWeather = currentWeather;
      state.hourlyForecast = hourlyForecast;
      state.dailyForecast = dailyForecast;
      state.airQuality = airQuality;
      state.uvIndex = uvIndex;
      state.weatherTheme = determineWeatherTheme(currentWeather);
      state.loading = false;
      state.error = null;
    },
    setSearchResults: (
      state,
      action: PayloadAction<WeatherState["searchResults"]>
    ) => {
      state.searchResults = action.payload;
    },
    clearSearchResults(state) {
      state.searchResults = [];
    },
    addFavoriteCity: (state, action: PayloadAction<string>) => {
      if (!state.favoriteCities.includes(action.payload)) {
        state.favoriteCities.push(action.payload);
        localStorage.setItem(
          "favoriteCities",
          JSON.stringify(state.favoriteCities)
        );
      }
    },
    removeFavoriteCity: (state, action: PayloadAction<string>) => {
      state.favoriteCities = state.favoriteCities.filter(
        (city) => city !== action.payload
      );
      localStorage.setItem(
        "favoriteCities",
        JSON.stringify(state.favoriteCities)
      );
    },
    clearFavoriteCities: (state) => {
      state.favoriteCities = [];
      localStorage.setItem("favoriteCities", JSON.stringify([]));
    },
    setFavoriteCities: (state, action: PayloadAction<string[]>) => {
      state.favoriteCities = action.payload;
      localStorage.setItem(
        "favoriteCities",
        JSON.stringify(state.favoriteCities)
      );
    },
    setWeatherTheme: (
      state,
      action: PayloadAction<WeatherState["weatherTheme"]>
    ) => {
      state.weatherTheme = action.payload;
    },
    setHistoricalData(
      state,
      action: PayloadAction<WeatherState["historicalData"]>
    ) {
      state.historicalData = action.payload;
    },
  },
});

export const {
  setLoading,
  setError,
  setWeatherTheme,
  setWeatherBundle,
  setHistoricalData,
  clearSearchResults,
  addFavoriteCity,
  removeFavoriteCity,
  setSearchResults,
  clearFavoriteCities,
  setFavoriteCities,
} = weatherSlice.actions;

export default weatherSlice.reducer;

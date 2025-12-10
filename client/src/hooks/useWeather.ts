import axios from "axios";
import { useCallback, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@app/store";
import type { WeatherState } from "@features/weather/types";
import type { CitySearchResult } from "@features/weather/types";
import {
  setLoading,
  setError,
  setWeatherBundle,
  setSearchResults,
  clearSearchResults,
  addFavoriteCity,
  removeFavoriteCity,
  setWeatherTheme,
} from "@features/weather/weatherSlice";

import {
  getWeatherByCoords as apiGetWeatherByCoords,
  getWeatherByCity as apiGetWeatherByCity,
  searchCities as apiSearchCities,
} from "@api/weatherAPI";
type WeatherTheme = WeatherState["weatherTheme"];
export const useWeather = () => {
  const dispatch = useDispatch<AppDispatch>();
  const weather = useSelector((s: RootState) => s.weather);
  const settings = useSelector((s: RootState) => s.settings);

  const fetchWeather = useCallback(
    async (lat: number, lon: number) => {
      dispatch(setLoading(true));
      try {
        const bundle = await apiGetWeatherByCoords(lat, lon);
        dispatch(setWeatherBundle(bundle));
      } catch (err: unknown) {
        let msg = "Failed to fetch weather data";
        if (axios.isAxiosError(err)) {
          msg = err.response?.data?.message || err.message;
        } else if (err instanceof Error) {
          msg = err.message;
        }
        dispatch(setError(msg));
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch]
  );

  const fetchWeatherByCity = useCallback(
    async (city: string) => {
      dispatch(setLoading(true));
      try {
        const bundle = await apiGetWeatherByCity(city);
        dispatch(setWeatherBundle(bundle));
      } catch (err: unknown) {
        let msg = "Failed to fetch weather data";
        if (axios.isAxiosError(err)) {
          msg = err.response?.data?.message || err.message;
        } else if (err instanceof Error) {
          msg = err.message;
        }
        dispatch(setError(msg));
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch]
  );

  const search = useCallback(
    async (query: string) => {
      try {
        const results = await apiSearchCities(query);
        dispatch(setSearchResults(results));
      } catch {
        // keep silent; searching isn't critical
        dispatch(setSearchResults([]));
      }
    },
    [dispatch]
  );

  const selectCity = useCallback(
    async (city: CitySearchResult) => {
      dispatch(setLoading(true));
      try {
        const bundle = await apiGetWeatherByCoords(city.lat, city.lon);
        dispatch(setWeatherBundle(bundle));
      } catch (err: unknown) {
        let msg = "Failed to fetch weather data";
        if (axios.isAxiosError(err)) {
          msg = err.response?.data?.message || err.message;
        } else if (err instanceof Error) {
          msg = err.message;
        }
        dispatch(setError(msg));
      } finally {
        dispatch(clearSearchResults());
        dispatch(setLoading(false));
      }
    },
    [dispatch]
  );

  // Refs for stable callbacks
  const weatherRef = useRef(weather);
  const settingsRef = useRef(settings);

  useEffect(() => {
    weatherRef.current = weather;
    settingsRef.current = settings;
  }, [weather, settings]);

  const toggleFavorite = useCallback(
    async (city: string) => {
      const currentFavorites = weatherRef.current.favoriteCities;
      const isLoggedIn = settingsRef.current.isLoggedIn;

      // Optimistic update
      if (currentFavorites.includes(city)) {
        dispatch(removeFavoriteCity(city));

        // Sync with server if logged in
        if (isLoggedIn) {
          try {
            await axios.post(
              "https://weather-app-server-3dt5.onrender.com/api/users/remove-favorite",
              { city },
              { withCredentials: true }
            );
          } catch (error) {
            console.error("Failed to remove favorite from server:", error);
            // Revert state
            dispatch(addFavoriteCity(city));
          }
        }
      } else {
        dispatch(addFavoriteCity(city));
        if (isLoggedIn) {
          try {
            await axios.post(
              "https://weather-app-server-3dt5.onrender.com/api/users/add-favorite",
              { city },
              { withCredentials: true }
            );
          } catch (error) {
            console.error("Failed to add favorite to server:", error);
            dispatch(removeFavoriteCity(city));
          }
        }
      }
    },
    [dispatch]
  );

  const clearSearch = useCallback(() => {
    dispatch(clearSearchResults());
  }, [dispatch]);

  const updateWeatherTheme = useCallback(
    (theme: WeatherTheme) => {
      dispatch(setWeatherTheme(theme));
    },
    [dispatch]
  );

  // Unit conversion helpers
  const convertTemp = useCallback(
    (tempC: number) => {
      if (settings.temperatureUnit === "fahrenheit") {
        return Math.round((tempC * 9) / 5 + 32);
      }
      return Math.round(tempC);
    },
    [settings.temperatureUnit]
  );

  const convertSpeed = useCallback(
    (speedMs: number) => {
      if (settings.speedUnit === "mph") {
        return Math.round(speedMs * 2.237);
      }
      return Math.round(speedMs * 3.6);
    },
    [settings.speedUnit]
  );

  const tempUnit = settings.temperatureUnit === "fahrenheit" ? "°F" : "°C";
  const speedUnit = settings.speedUnit === "mph" ? "mph" : "km/h";

  return {
    ...weather,
    fetchWeather,
    fetchWeatherByCity, // new, handy for search bars
    search,
    selectCity,
    toggleFavorite,
    clearSearch,
    updateWeatherTheme,
    convertTemp,
    convertSpeed,
    tempUnit,
    speedUnit,
    settings,
  };
};

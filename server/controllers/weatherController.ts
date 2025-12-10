import { Request, Response } from "express";
import axios from "axios";

const API_KEY = process.env.WEATHER_API_KEY;
const BASE_URL = process.env.WEATHER_BASE_URL;
const GEO_URL = process.env.WEATHER_GEO_URL;

// @desc    Get current weather
// @route   GET /api/weather/current
// @access  Public (or Private)
export const getCurrentWeather = async (req: Request, res: Response) => {
  try {
    const { lat, lon, q, units = "metric" } = req.query;

    if ((!lat || !lon) && !q) {
      res
        .status(400)
        .json({ message: "Latitude/Longitude or Query is required" });
      return;
    }

    const { data } = await axios.get(`${BASE_URL}/weather`, {
      params: { lat, lon, q, units, appid: API_KEY },
    });

    res.json(data);
  } catch (error: unknown) {
    let statusCode = 500;
    let message = "Failed to fetch weather data";

    if (axios.isAxiosError(error)) {
      statusCode = error.response?.status || 500;
      message = error.response?.data?.message || message;
    } else if (error instanceof Error) {
      message = error.message;
    }

    res.status(statusCode).json({ message });
  }
};

// @desc    Get forecast (hourly/daily implicitly via 5-day forecast endpoints)
// @route   GET /api/weather/forecast
// @access  Public
export const getForecast = async (req: Request, res: Response) => {
  try {
    const { lat, lon, units = "metric" } = req.query;

    if (!lat || !lon) {
      res.status(400).json({ message: "Latitude and Longitude are required" });
      return;
    }

    const { data } = await axios.get(`${BASE_URL}/forecast`, {
      params: { lat, lon, units, appid: API_KEY },
    });

    res.json(data);
  } catch (error: unknown) {
    let statusCode = 500;
    let message = "Failed to fetch forecast data";

    if (axios.isAxiosError(error)) {
      statusCode = error.response?.status || 500;
      message = error.response?.data?.message || message;
    } else if (error instanceof Error) {
      message = error.message;
    }

    res.status(statusCode).json({ message });
  }
};

// @desc    Get air pollution
// @route   GET /api/weather/air_pollution
// @access  Public
export const getAirPollution = async (req: Request, res: Response) => {
  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      res.status(400).json({ message: "Latitude and Longitude are required" });
      return;
    }

    const { data } = await axios.get(`${BASE_URL}/air_pollution`, {
      params: { lat, lon, appid: API_KEY },
    });

    res.json(data);
  } catch (error: unknown) {
    let statusCode = 500;
    let message = "Failed to fetch air pollution data";

    if (axios.isAxiosError(error)) {
      statusCode = error.response?.status || 500;
      message = error.response?.data?.message || message;
    } else if (error instanceof Error) {
      message = error.message;
    }

    res.status(statusCode).json({ message });
  }
};

// @desc    Geocode city (Direct) via OWM
// @route   GET /api/weather/geo/direct
// @access  Public
export const getDirectGeocoding = async (req: Request, res: Response) => {
  try {
    const { q, limit = 5 } = req.query;

    if (!q) {
      res.status(400).json({ message: "Query q is required" });
      return;
    }

    const { data } = await axios.get(`${GEO_URL}/direct`, {
      params: { q, limit, appid: API_KEY },
    });

    res.json(data);
  } catch (error: unknown) {
    let statusCode = 500;
    let message = "Failed to fetch geocoding data";

    if (axios.isAxiosError(error)) {
      statusCode = error.response?.status || 500;
      message = error.response?.data?.message || message;
    } else if (error instanceof Error) {
      message = error.message;
    }

    res.status(statusCode).json({ message });
  }
};

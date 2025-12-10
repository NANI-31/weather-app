import axios from "axios";
import type {
  WeatherData,
  ForecastItem,
  AirQuality,
  CitySearchResult,
  ForecastResponse,
  GeocodingAPIResponse,
  OpenMeteoSearchResult,
} from "./types.ts";

export interface WeatherBundle {
  currentWeather: WeatherData;
  hourlyForecast: ForecastItem[];
  dailyForecast: ForecastItem[];
  airQuality: AirQuality;
  uvIndex: number | null; // keep null or a fallback value
}

// NOTE: We now use our centralized config.
import { API_BASE_URL } from "./config";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // important if you want cookies later, but fine here
});

// --- Helpers ---
const toHourly = (forecastData: ForecastResponse): ForecastItem[] => {
  const list = forecastData.list ?? [];
  return list.slice(0, 12).map((item) => ({
    dt: item.dt,
    temp: item.main.temp,
    temp_min: item.main.temp_min,
    temp_max: item.main.temp_max,
    humidity: item.main.humidity,
    description: item.weather[0].description,
    icon: item.weather[0].icon,
    main: item.weather[0].main,
    wind_speed: item.wind.speed,
    pop: item.pop,
  }));
};

const toDaily = (forecastData: ForecastResponse): ForecastItem[] => {
  const map = new Map<string, ForecastItem[]>();
  const list = forecastData.list ?? [];

  list.forEach((item) => {
    const dateKey = new Date(item.dt * 1000).toDateString();
    const fi: ForecastItem = {
      dt: item.dt,
      temp: item.main.temp,
      temp_min: item.main.temp_min,
      temp_max: item.main.temp_max,
      humidity: item.main.humidity,
      description: item.weather[0].description,
      icon: item.weather[0].icon,
      main: item.weather[0].main,
      wind_speed: item.wind.speed,
      pop: item.pop,
    };
    if (!map.has(dateKey)) map.set(dateKey, []);
    map.get(dateKey)!.push(fi);
  });

  return Array.from(map.values()).map((items) => {
    const mid = items[Math.floor(items.length / 2)];
    return {
      dt: items[0].dt,
      temp: items.reduce((s, i) => s + i.temp, 0) / items.length,
      temp_min: Math.min(...items.map((i) => i.temp_min)),
      temp_max: Math.max(...items.map((i) => i.temp_max)),
      humidity: Math.round(
        items.reduce((s, i) => s + i.humidity, 0) / items.length
      ),
      description: mid.description,
      icon: mid.icon,
      main: mid.main,
      wind_speed: items.reduce((s, i) => s + i.wind_speed, 0) / items.length,
      pop: Math.max(...items.map((i) => i.pop ?? 0)),
    };
  });
};

export async function geocodeCity(
  city: string
): Promise<{ lat: number; lon: number }> {
  // Use our backend proxy for direct geocoding
  const { data } = await api.get(`/weather/geo/direct`, {
    params: { q: city, limit: 1 },
  });
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("City not found");
  }
  return { lat: data[0].lat, lon: data[0].lon };
}

export async function searchCities(
  query: string,
  signal?: AbortSignal
): Promise<CitySearchResult[]> {
  if (!query || query.trim().length < 2) return [];

  try {
    // Keep using Open-Meteo as it is free and doesn't require key, OR proxy it too if desired.
    // For now, Open-Meteo is public/free, so client-side call is fine and faster.
    const { data } = await axios.get(
      `https://geocoding-api.open-meteo.com/v1/search`,
      {
        params: { name: query, count: 5, language: "en", format: "json" },
        signal,
      }
    );

    if (!data.results) return [];

    return data.results.map((c: OpenMeteoSearchResult) => ({
      name: c.name,
      lat: c.latitude,
      lon: c.longitude,
      country: c.country,
      state: c.admin1,
    }));
  } catch (error) {
    console.warn(
      "Open-Meteo search failed, falling back to OWM via Proxy",
      error
    );
    // Fallback to our proxy for OWM
    const { data } = await api.get(`/weather/geo/direct`, {
      params: { q: query, limit: 5 },
      signal,
    });
    return (data ?? []).map((c: GeocodingAPIResponse) => ({
      name: c.name,
      lat: c.lat,
      lon: c.lon,
      country: c.country,
      state: c.state,
    }));
  }
}

export async function getWeatherByCoords(
  lat: number,
  lon: number
): Promise<WeatherBundle> {
  // Calls go to /api/weather/...
  const [weatherRes, forecastRes, airRes] = await Promise.all([
    api.get("/weather/current", {
      params: { lat, lon, units: "metric" },
    }),
    api.get("/weather/forecast", {
      params: { lat, lon, units: "metric" },
    }),
    api.get("/weather/air_pollution", {
      params: { lat, lon },
    }),
  ]);

  // Validate responses
  if (weatherRes.status !== 200 || !weatherRes.data || !weatherRes.data.sys) {
    throw new Error(
      weatherRes.data?.message || "Failed to fetch current weather"
    );
  }
  if (forecastRes.status !== 200 || !forecastRes.data) {
    throw new Error(forecastRes.data?.message || "Failed to fetch forecast");
  }

  const weatherData = weatherRes.data;
  const forecastData = forecastRes.data;
  const airData = airRes.data;

  const currentWeather: WeatherData = {
    city: weatherData.name,
    country: weatherData.sys.country,
    temp: weatherData.main.temp,
    feels_like: weatherData.main.feels_like,
    humidity: weatherData.main.humidity,
    pressure: weatherData.main.pressure,
    wind_speed: weatherData.wind.speed,
    wind_deg: weatherData.wind.deg,
    visibility: weatherData.visibility,
    description: weatherData.weather[0].description,
    icon: weatherData.weather[0].icon,
    main: weatherData.weather[0].main,
    clouds: weatherData.clouds.all,
    sunrise: weatherData.sys.sunrise,
    sunset: weatherData.sys.sunset,
    timezone: weatherData.timezone,
    dt: weatherData.dt,
    lat,
    lon,
  };

  const hourlyForecast = toHourly(forecastData);
  const dailyForecast = toDaily(forecastData);

  const airQuality: AirQuality = {
    aqi: airData.list?.[0]?.main?.aqi ?? 0,
    co: airData.list?.[0]?.components?.co ?? 0,
    no: airData.list?.[0]?.components?.no ?? 0,
    no2: airData.list?.[0]?.components?.no2 ?? 0,
    o3: airData.list?.[0]?.components?.o3 ?? 0,
    so2: airData.list?.[0]?.components?.so2 ?? 0,
    pm2_5: airData.list?.[0]?.components?.pm2_5 ?? 0,
    pm10: airData.list?.[0]?.components?.pm10 ?? 0,
  };

  const uvIndex: number | null = 5;

  return {
    currentWeather,
    hourlyForecast,
    dailyForecast,
    airQuality,
    uvIndex,
  };
}

export async function getWeatherByCity(city: string): Promise<WeatherBundle> {
  const { lat, lon } = await geocodeCity(city);
  return getWeatherByCoords(lat, lon);
}

export async function getCurrentWeather(city: string): Promise<WeatherData> {
  const { data } = await api.get("/weather/current", {
    params: { q: city, units: "metric" },
  });

  if (data.cod && data.cod !== 200 && data.cod !== "200") {
    throw new Error(data.message || "Failed to fetch weather");
  }
  if (!data.sys || !data.main) {
    throw new Error("Invalid weather data received");
  }

  return {
    city: data.name,
    country: data.sys.country,
    temp: data.main.temp,
    feels_like: data.main.feels_like,
    humidity: data.main.humidity,
    pressure: data.main.pressure,
    wind_speed: data.wind.speed,
    wind_deg: data.wind.deg,
    visibility: data.visibility,
    description: data.weather[0].description,
    icon: data.weather[0].icon,
    main: data.weather[0].main,
    clouds: data.clouds.all,
    sunrise: data.sys.sunrise,
    sunset: data.sys.sunset,
    timezone: data.timezone,
    dt: data.dt,
    lat: data.coord.lat,
    lon: data.coord.lon,
  };
}

import axios from "axios";
import type {
  WeatherData,
  ForecastItem,
  AirQuality,
  CitySearchResult,
  ForecastResponse,
  GeocodingAPIResponse,
} from "./types.ts";

export interface WeatherBundle {
  currentWeather: WeatherData;
  hourlyForecast: ForecastItem[];
  dailyForecast: ForecastItem[];
  airQuality: AirQuality;
  uvIndex: number | null; // keep null or a fallback value
}

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL = import.meta.env.VITE_BASE_URL;
const GEO_URL = import.meta.env.VITE_GEO_URL;

const api = axios.create({
  baseURL: BASE_URL,
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
  const { data } = await api.get(`${GEO_URL}/direct`, {
    params: { q: city, limit: 1, appid: API_KEY },
  });
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("City not found");
  }
  return { lat: data[0].lat, lon: data[0].lon };
}

export async function searchCities(query: string): Promise<CitySearchResult[]> {
  if (!query || query.trim().length < 2) return [];

  try {
    // Use Open-Meteo for better autocomplete/fuzzy matching
    const { data } = await axios.get(
      `https://geocoding-api.open-meteo.com/v1/search`,
      {
        params: { name: query, count: 5, language: "en", format: "json" },
      }
    );

    if (!data.results) return [];

    return data.results.map((c: any) => ({
      name: c.name,
      lat: c.latitude,
      lon: c.longitude,
      country: c.country,
      state: c.admin1,
    }));
  } catch (error) {
    console.warn("Open-Meteo search failed, falling back to OWM", error);
    // Fallback to strict OWM search if Open-Meteo fails
    const { data } = await axios.get(`${GEO_URL}/direct`, {
      params: { q: query, limit: 5, appid: API_KEY },
    });
    return (data ?? []).map((c: any) => ({
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
  const [weatherRes, forecastRes, airRes] = await Promise.all([
    api.get("/weather", {
      params: { lat, lon, appid: API_KEY, units: "metric" },
    }),
    api.get("/forecast", {
      params: { lat, lon, appid: API_KEY, units: "metric" },
    }),
    api.get("/air_pollution", {
      params: { lat, lon, appid: API_KEY },
    }),
    // api.get("/uvi", {
    //   params: { lat, lon, appid: API_KEY },
    // }),
  ]);

  const weatherData = weatherRes.data;
  const forecastData = forecastRes.data;
  const airData = airRes.data;
  // const uvData = uvRes.data;
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

  // Free tier: OneCall UV may not be available; keep null or compute later if you add OneCall
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
  const { data } = await api.get("/weather", {
    params: { q: city, appid: API_KEY, units: "metric" },
  });

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

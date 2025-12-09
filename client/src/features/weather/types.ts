export interface WeatherData {
  city: string;
  country: string;
  temp: number;
  feels_like: number;
  humidity: number;
  pressure: number;
  wind_speed: number;
  wind_deg: number;
  visibility: number;
  description: string;
  icon: string;
  main: string;
  clouds: number;
  sunrise: number;
  sunset: number;
  timezone: number;
  dt: number;
  lat: number;
  lon: number;
}

export interface ForecastItem {
  dt: number;
  temp: number;
  temp_min: number;
  temp_max: number;
  humidity: number;
  description: string;
  icon: string;
  main: string;
  wind_speed: number;
  pop: number;
}

export interface AirQuality {
  aqi: number;
  co: number;
  no: number;
  no2: number;
  o3: number;
  so2: number;
  pm2_5: number;
  pm10: number;
}

export interface CitySearchResult {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

export interface WeatherState {
  currentWeather: WeatherData | null;
  hourlyForecast: ForecastItem[];
  dailyForecast: ForecastItem[];
  airQuality: AirQuality | null;
  uvIndex: number | null;
  favoriteCities: string[];
  searchResults: CitySearchResult[];
  historicalData: { date: string; temp: number; humidity: number }[];
  loading: boolean;
  error: string | null;
  weatherTheme: "sunny" | "rainy" | "cloudy" | "snowy" | "night";
}
